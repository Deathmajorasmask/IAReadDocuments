const { ocrSpace } = require("ocr-space-api-wrapper");
const naturalfnController = require("./natural.controller");
const pdfParse = require("pdf-parse");

async function fnOcrExtractData(dirPathDoc) {
  console.log("-----------ocrspace----------");
  let res = ocrSpace(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  );
  console.log("-----------End_ocrspace----------");
  return res;
}

async function fnOcrExtractClassify(dirPathDoc) {
  console.log("-----------pdfParse----------");
  let pdfParseData = await fnPdfParseExtractData(dirPathDoc);
  console.log("-----------End_pdfParse----------");
  let res = "";
  console.log("--------------NaturalClassify------------------");
  if (
    !pdfParseData ||
    pdfParseData.length <= 0 ||
    pdfParseData.match(/^\s*$/) !== null
  ) {
    console.log("-1_Documento_NoCategorizado");
  } else {
    res = naturalfnController.fnGetClassifyData(pdfParseData);
  }
  console.log("--------------End_NaturalClassify------------------");
  return res;
}

async function fnPdfParseExtractData(dirPathDoc) {
  return pdfParse(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  ).then((result) => {
    return result.text;
  });
}

module.exports = {
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