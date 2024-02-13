import { ocrSpace } from "ocr-space-api-wrapper";
import { fnGetClassifyData } from "./natural.controller.js";

// winston logs file config
import logger from "../logs_module/logs.controller.js";

let rows = {}; // indexed by y-position
let resultDocument = ""; // variable by return
import { PdfReader, Rule } from "pdfreader";

function flushRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => (resultDocument += (rows[y] || []).join(" ")));
  rows = {}; // clear rows for next page
}

// Extract information in raw format from any PDF file
async function fnOcrExtractDataReader(dirPathDoc) {
  let PdfReaderAsync = () => {
    return new Promise((res, rej) => {
      new PdfReader().parseFileItems(
        __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
        (err, item) => {
          if (err) {
            logger.error({ err });
          } else if (!item) {
            flushRows();
            resultDocument += "(END_OF_FILE)";
            res(resultDocument);
          } else if (item.page) {
            flushRows(); // print the rows of the previous page
            resultDocument += `(PAGE ${item.page})`;
          } else if (item.text) {
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
          }
        }
      );
    });
  };
  
  try {
    resultDocument = ""; // clear page for next documents
    let item = await PdfReaderAsync();
    resultDocument = ""; // clear page for next documents
    let result = {
      status: 200,
      isRaw: true,
      body: item,
      headers: {
        "Content-Type": "application/json",
      },
      IsErroredOnProcessing: false,
      ErrorMessage: "",
    };
    return result;
  } catch (err) {
    logger.error({ err });
    resultDocument = ""; // clear page for next documents
    rows = {}; // clear rows for next page
    let result = {
      status: 204,
      isRaw: true,
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
      IsErroredOnProcessing: true,
      ErrorMessage: err,
    };
    return result;
  }
}

// Extract information in raw format from any PDF file with password
async function fnOcrExtractDataReaderPassword(dirPathDoc, pdfPassword) {
  let PdfReaderAsync = () => {
    return new Promise((res, rej) => {
      new PdfReader({ password: pdfPassword }).parseFileItems(
        __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
        function (err, item) {
          if (err) {
            logger.error(err);
          } else if (!item) {
            flushRows();
            resultDocument += "(END_OF_FILE)";
            res(resultDocument);
          } else if (item.page) {
            flushRows(); // print the rows of the previous page
            resultDocument += `(PAGE ${item.page})`;
          } else if (item.text) {
            (rows[item.y] = rows[item.y] || []).push(item.text);
          }
        }
      );
    });
  };

  try {
    resultDocument = ""; // clear page for next documents
    let item = await PdfReaderAsync();
    resultDocument = ""; // clear page for next documents
    let result = {
      status: 200,
      isRaw: true,
      body: item,
      headers: {
        "Content-Type": "application/json",
      },
      IsErroredOnProcessing: false,
      ErrorMessage: "",
    };
    return result;
  } catch (err) {
    logger.error({ err });
    resultDocument = ""; // clear page for next documents
    rows = {}; // clear rows for next page
    let result = {
      status: 204,
      isRaw: true,
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
      IsErroredOnProcessing: true,
      ErrorMessage: err,
    };
    return result;
  }
}

// In progress...
async function fnOcrExtractDataReaderRuleOnTable(dirPathDoc) {
  const processItem = Rule.makeItemProcessor([
    Rule.on(/^Hello \"(.*)\"$/)
      .extractRegexpValues()
      .then(displayValue),
    Rule.on(/^Value\:/)
      .parseNextItemValue()
      .then(displayValue),
    Rule.on(/^c1$/).parseTable(3).then(displayTable),
    Rule.on(/^Values\:/)
      .accumulateAfterHeading()
      .then(displayValue),
  ]);
  new PdfReader().parseFileItems(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
    (err, item) => {
      if (err) console.error(err);
      else processItem(item);
    }
  );
}

// In progress...
async function fnOcrExtractDataReaderOnTable(dirPathDoc) {
  const nbCols = 2;
  const cellPadding = 40; // each cell is padded to fit 40 characters
  const columnQuantitizer = (item) => parseFloat(item.x) >= 20;

  const padColumns = (array, nb) =>
    Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
  // .. because map() skips undefined elements - nb length

  const mergeCells = (cells) =>
    (cells || [])
      .map((cell) => cell.text)
      .join("") // merge cells
      .substr(0, cellPadding)
      .padEnd(cellPadding, " "); // padding

  const renderMatrix = (matrix) =>
    (matrix || [])
      .map((row, y) => padColumns(row, nbCols).map(mergeCells).join(" | "))
      .join("\n");

  var table = new PdfReader.TableParser();

  new PdfReader.PdfReader().parseFileItems(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
    function (err, item) {
      if (!item || item.page) {
        // end of file, or page
        console.log(renderMatrix(table.getMatrix()));
        console.log("PAGE:", item.page);
        table = new PdfReader.TableParser(); // new/clear table for next page
      } else if (item.text) {
        // accumulate text items into rows object, per line
        table.processItem(item, columnQuantitizer(item));
      }
    }
  );
}

// Payment information extractor (OCR not used)
async function fnOcrExtractData(dirPathDoc) {
  let res = ocrSpace(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  );
  return res;
}

// Extract classification and categorization using IA Natural
async function fnOcrExtractClassify(dirPathDoc) {
  let pdfParseData = await fnOcrExtractDataReader(dirPathDoc);
  let res = "";
  if (
    !pdfParseData.body ||
    pdfParseData.body.length <= 0 ||
    pdfParseData.body.match(/^\s*$/) !== null
  ) {
    res = "-1_33_Documento_NoCategorizado";
  } else {
    res = fnGetClassifyData(pdfParseData.body);
  }
  return res;
}

export {
  fnOcrExtractDataReader,
  fnOcrExtractDataReaderPassword,
  fnOcrExtractDataReaderRuleOnTable,
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
