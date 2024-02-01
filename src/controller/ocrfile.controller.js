import { ocrSpace } from "ocr-space-api-wrapper";
import { fnGetClassifyData } from "./natural.controller.js";
import pdfParse from "pdf-parse";
  
// winston logs file config
import logger from "../logs_module/logs.controller.js";

let rows = {}; // indexed by y-position
import { PdfReader } from "pdfreader";

function flushRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => console.log((rows[y] || []).join("")));
  rows = {}; // clear rows for next page
}

async function fnOcrExtractDataReader(dirPathDoc){
  new PdfReader().parseFileItems( __basedir + "/resources/static/assets/uploads/" + dirPathDoc, (err, item) => {
    if (err) {
      logger.error({ err });
    } else if (!item) {
      flushRows();
      logger.info("END OF FILE");
    } else if (item.page) {
      flushRows(); // print the rows of the previous page
      logger.info(`PAGE: ${ item.page }`);
    } else if (item.text) {
      // accumulate text items into rows object, per line
      (rows[item.y] = rows[item.y] || []).push(item.text);
    }
  });
}

async function fnOcrExtractData(dirPathDoc) {
  let res = ocrSpace(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  );
  return res;
}

async function fnOcrExtractClassify(dirPathDoc) {
  let pdfParseData = await fnPdfParseExtractData(dirPathDoc);
  let res = "";
  if (
    !pdfParseData ||
    pdfParseData.length <= 0 ||
    pdfParseData.match(/^\s*$/) !== null
  ) {
    res = "-1_33_Documento_NoCategorizado";
  } else {
    res = fnGetClassifyData(pdfParseData);
  }
  return res;
}

async function fnPdfParseExtractData(dirPathDoc) {
  return pdfParse(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  ).then((result) => {
    return result.text;
  });
}

export {
  fnOcrExtractDataReader,
  fnOcrExtractData,
  fnOcrExtractClassify,
};

/*********************
1 = Pólizas
2 = Other Documments
Example = 1_2_Flotillas_Chubb
Significa que es una poliza (1), de Flotillas Autos(2), Flotilla (Flotillas) de la aseguradora Chubb
Other Example = 2_33_cDom_Agua
Significa que es algo que NO es póliza (2), Otro tipo de documento (33), categorizado como comprobante de Domicilio (cDom), y del Agua
**********************
Catalogo de Samples
**********************
1 Catalogo de Pólizas
2 Catalogo General
**********************
**********************
Catalogo General
**********************
1	Acta Administrativa
2	Acta de Defunción
3	Acta de Divorcio
4	Acta de Matrimonio
5	Acta de Nacimiento
6	Acta Ministerio Publico
7	Bitacora
8	Carnet
9	Carta
10	Certificado
11	Constancia
12	CURP
13	Declaracion anual
14	Dictamen
15	Endoso
16	Estados financieros
17	Factura
18	Formato
19	Fotografía
20	ID
21	INE
22	Licencia de Conducir
23	Manual
24	Pasaporte
25	Poliza /Ya no se usa/
26	Recibo
27	Reporte
28	CIF
29	Resultados clínicos
30	Nota de Crédito
31	Nota de Débito
32	Complemento de Pago
33	Otros
*********************/