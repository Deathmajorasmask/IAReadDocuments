import { ocrSpace } from "ocr-space-api-wrapper";
import { fnGetClassifyData } from "./natural.controller.js";

// winston logs file config
import logger from "../logs_module/logs.controller.js";

let rows = {}; // indexed by y-position
let resultDocument = ""; // variable by return
import { PdfReader, Rule } from "pdfreader";

// Helps scroll reading cursor for pdf file
function flushRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => (resultDocument += (rows[y] || []).join(" ")));
  rows = {}; // clear rows for next page
}

// Returns the value to be displayed in the REGEX function
function displayValue(values) {
  return values;
}

// Extract information in raw format from any PDF file
async function fnOcrEDR(dirPathDoc) {
  try {
    resultDocument = ""; // clear page for next documents
    let item = await fnOcrEDataReader(dirPathDoc);
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

async function fnOcrEDataReader(dirPathDoc) {
  return new Promise((resolve, reject) => {
    new PdfReader().parseFileItems(
      __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
      (err, item) => {
        if (err) {
          reject({ err });
        } else if (!item) {
          flushRows();
          resultDocument += "(END_OF_FILE)";
          resolve(resultDocument);
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
}

// Extract information in raw format from any PDF file with password
async function fnOcrEDRPassword(dirPathDoc, pdfPassword) {
  try {
    resultDocument = ""; // clear page for next documents
    const item = await fnOcrEDataReaderPassword(dirPathDoc, pdfPassword);
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

async function fnOcrEDataReaderPassword(dirPathDoc, pdfPassword) {
  return new Promise((resolve, reject) => {
    new PdfReader({ password: pdfPassword }).parseFileItems(
      __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
      function (err, item) {
        if (err) {
          reject(err);
        } else if (!item) {
          flushRows();
          resultDocument += "(END_OF_FILE)";
          resolve(resultDocument);
        } else if (item.page) {
          flushRows(); // print the rows of the previous page
          resultDocument += `(PAGE ${item.page})`;
        } else if (item.text) {
          (rows[item.y] = rows[item.y] || []).push(item.text);
        }
      }
    );
  });
}

// Extract information in raw format from any PDF file with REGEX rules
async function fnOcrEDRegexv(dirPathDoc, regexRule) {
  try {
    let result = {};
    if (typeof regexRule === "object") {
      if (Object.keys(regexRule).length < 1) {
        const values = await fnOcrEDataReaderRegex(dirPathDoc, regexRule);
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      } else {
        let regexRuleProp = Object.values(regexRule);
        let values = [];
        for (var i = 0; i < regexRuleProp.length; i++) {
          values.push(
            await fnOcrEDataReaderRegex(dirPathDoc, regexRuleProp[i])
          );
        }
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      }
    } else if (typeof regexRule === "string") {
      if (regexRule.startsWith("{")) {
        regexRule = eval("(" + regexRule + ")");
      } else {
        regexRule = "{ key1 : " + regexRule + " }";
        regexRule = eval("(" + regexRule + ")");
      }

      if (Object.keys(regexRule).length < 1) {
        const values = await fnOcrEDataReaderRegex(dirPathDoc, regexRule);
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      } else {
        let regexRuleProp = Object.values(regexRule);
        let values = [];
        for (var i = 0; i < regexRuleProp.length; i++) {
          values.push(
            await fnOcrEDataReaderRegex(dirPathDoc, regexRuleProp[i])
          );
        }
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      }
    } else {
      result = {
        status: 204,
        isRaw: true,
        body: "",
        headers: {
          "Content-Type": "application/json",
        },
        IsErroredOnProcessing: true,
        ErrorMessage:
          "regexRule is not of type object / does not contain identifier '{key1: , key2: ...}'",
      };
    }
    return result; // Return the values ​​extracted from the PDF
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

async function fnOcrEDataReaderRegex(dirPathDoc, regexRule) {
  return new Promise((resolve, reject) => {
    const extractedValues = [];
    const processItem = Rule.makeItemProcessor([
      Rule.on(regexRule) // /^Hello \"(.*)\"$/
        .extractRegexpValues()
        .then((values) => extractedValues.push(displayValue(values))),
    ]);

    new PdfReader().parseFileItems(
      __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
      (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          processItem(item);
          // When there are no more items, we resolve the promise with the extracted values
          resolve(extractedValues);
        } else {
          processItem(item);
        }
      }
    );
  });
}

// Extract information in raw format from any PDF file with REGEX rules the following value
async function fnOcrEDNextRegexv(dirPathDoc, regexRule) {
  try {
    let result = {};
    if (typeof regexRule === "object") {
      if (Object.keys(regexRule).length < 1) {
        const values = await fnOcrEDataReaderNextRegex(dirPathDoc, regexRule);
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      } else {
        let regexRuleProp = Object.values(regexRule);
        let values = [];
        for (var i = 0; i < regexRuleProp.length; i++) {
          values.push(
            await fnOcrEDataReaderNextRegex(dirPathDoc, regexRuleProp[i])
          );
        }
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      }
    } else if (typeof regexRule === "string") {
      if (regexRule.startsWith("{")) {
        regexRule = eval("(" + regexRule + ")");
      } else {
        regexRule = "{ key1 : " + regexRule + " }";
        regexRule = eval("(" + regexRule + ")");
      }

      if (Object.keys(regexRule).length < 1) {
        const values = await fnOcrEDataReaderNextRegex(dirPathDoc, regexRule);
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      } else {
        let regexRuleProp = Object.values(regexRule);
        let values = [];
        for (var i = 0; i < regexRuleProp.length; i++) {
          values.push(
            await fnOcrEDataReaderNextRegex(dirPathDoc, regexRuleProp[i])
          );
        }
        result = {
          status: 200,
          isRaw: true,
          body: values,
          headers: {
            "Content-Type": "application/json",
          },
          IsErroredOnProcessing: false,
          ErrorMessage: "",
        };
      }
    } else {
      result = {
        status: 204,
        isRaw: true,
        body: "",
        headers: {
          "Content-Type": "application/json",
        },
        IsErroredOnProcessing: true,
        ErrorMessage:
          "regexRule is not of type object or string / does not contain identifier '{key1: , key2: ...}'",
      };
    }
    return result; // Return the values ​​extracted from the PDF
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

async function fnOcrEDataReaderNextRegex(dirPathDoc, regexRule) {
  return new Promise((resolve, reject) => {
    const extractedValues = [];
    const processItem = Rule.makeItemProcessor([
      Rule.on(regexRule) // /^Value\:/
        .parseNextItemValue()
        .then((values) => extractedValues.push(displayValue(values))),
    ]);

    new PdfReader().parseFileItems(
      __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
      (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          processItem(item);
          // When there are no more items, we resolve the promise with the extracted values
          resolve(extractedValues);
        } else {
          processItem(item);
        }
      }
    );
  });
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
  let pdfParseData = await fnOcrEDR(dirPathDoc);
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
  fnOcrEDR,
  fnOcrEDRPassword,
  fnOcrEDRegexv,
  fnOcrEDNextRegexv,
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
