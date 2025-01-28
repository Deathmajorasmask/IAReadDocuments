// fs module
import { existsSync, readdirSync, lstatSync, writeFileSync } from "fs";
import { join, extname } from "path";

// utils file
import {
  fnRemoveExtensionFile,
  fnReturnCustomSamplesFolderPath,
  fnReturnSamplesFolderPath,
  fnSaveCustomSamplesInJSON,
} from "./file.utils.controller.js";

// Natural IA
import {
  fnGetClassifyData,
  fnTrainingDataIA,
  readDataSamples,
} from "./natural.controller.js";

// winston logs file config
import logger from "../logs_module/logs.controller.js";

// send http request
import https from "https";

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

function addTextToLines(textLines, item) {
  const existingLine = textLines.find(({ y }) => y === item.y);
  if (existingLine) {
    existingLine.text += " " + item.text;
  } else {
    textLines.push(item);
  }
}

// Extract information in raw format from any PDF file
async function fnOcrEDR(dirPathDoc) {
  try {
    resultDocument = ""; // clear page for next documents
    let item = await fnOcrEDataReader(dirPathDoc);
    resultDocument = ""; // clear page for next documents
    let result = item;
    return result;
  } catch (err) {
    logger.error({ err });
    resultDocument = ""; // clear page for next documents
    rows = {}; // clear rows for next page
    let result = "";
    return result;
  }
}

// Private function read OCR
async function fnOcrEDataReader(dirPathDoc) {
  return new Promise((resolve, reject) => {
    new PdfReader().parseFileItems(dirPathDoc, (err, item) => {
      if (err) {
        reject(new Error({ err }));
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
    });
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

// Private function read OCR with password
async function fnOcrEDataReaderPassword(dirPathDoc, pdfPassword) {
  return new Promise((resolve, reject) => {
    new PdfReader({ password: pdfPassword }).parseFileItems(
      dirPathDoc,
      function (err, item) {
        if (err) {
          reject(new Error({ err }));
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
        for (const element of regexRuleProp) {
          values.push(await fnOcrEDataReaderRegex(dirPathDoc, element));
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
        for (const element of regexRuleProp) {
          values.push(await fnOcrEDataReaderRegex(dirPathDoc, element));
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
  console.log(regexRule);
  return new Promise((resolve, reject) => {
    const extractedValues = [];
    const processItem = Rule.makeItemProcessor([
      Rule.on(regexRule) // /^Hello \"(.*)\"$/
        .extractRegexpValues()
        .then((values) => extractedValues.push(displayValue(values))),
    ]);

    new PdfReader().parseFileItems(dirPathDoc, (err, item) => {
      if (err) {
        reject(new Error({ err }));
      } else if (!item) {
        processItem(item);
        // When there are no more items, we resolve the promise with the extracted values
        resolve(extractedValues);
      } else {
        processItem(item);
      }
    });
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
        for (const element of regexRuleProp) {
          values.push(await fnOcrEDataReaderNextRegex(dirPathDoc, element));
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
        for (const element of regexRuleProp) {
          values.push(await fnOcrEDataReaderNextRegex(dirPathDoc, element));
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
      dirPathDoc /* __basedir + "/resources/static/assets/uploads/" + dirPathDoc, */,
      (err, item) => {
        if (err) {
          reject(new Error({ err }));
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

// Extract information in raw format from any PDF file web link host
async function fnOcrExtractDataReaderFromWeb(urlWeb) {
  const get = (url) =>
    new Promise((resolve, reject) =>
      https
        .get(url, (res) => {
          const data = [];
          res
            .on("data", (chunk) => data.push(chunk))
            .on("end", () => resolve(Buffer.concat(data)));
        })
        .on("error", reject)
    );

  const parseLinesPerPage = (buffer) =>
    new Promise((resolve, reject) => {
      const linesPerPage = [];
      let pageNumber = 0;
      new PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) reject(new Error({ err }));
        else if (!item) {
          resolve(linesPerPage.map((page) => page.map((line) => line.text)));
        } else if (item.page) {
          pageNumber = item.page - 1;
          linesPerPage[pageNumber] = [];
        } else if (item.text) {
          addTextToLines(linesPerPage[pageNumber], item);
        }
      });
    });

  const url = new URL(urlWeb);

  const linesPerPage = await get(url).then((buffer) =>
    parseLinesPerPage(buffer)
  );

  return linesPerPage;
}

async function fnOcrEDRFromWeb(urlWeb) {
  try {
    let item = await fnOcrExtractDataReaderFromWeb(urlWeb);
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
async function fnOcrExtractDataReaderOnTable(dirPathDoc) {
  const nbCols = 2;
  const cellPadding = 40; // each cell is padded to fit 40 characters
  const columnQuantitizer = (item) => parseFloat(item.x) >= 20;

  const padColumns = (array, nb) =>
    Array(...{ length: nb }).map((val, i) => array[i] || []);
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

  let table = new PdfReader.TableParser();

  new PdfReader.PdfReader().parseFileItems(dirPathDoc, function (err, item) {
    if (!item || item.page) {
      // end of file, or page
      console.log(renderMatrix(table.getMatrix()));
      console.log("PAGE:", item.page);
      table = new PdfReader.TableParser(); // new/clear table for next page
    } else if (item.text) {
      // accumulate text items into rows object, per line
      table.processItem(item, columnQuantitizer(item));
    }
  });
}

// Extract classification and categorization using IA Natural
async function fnOcrExtractClassify(dirPathDoc) {
  let pdfParseData = await fnOcrEDR(dirPathDoc);
  let res = "";
  if (
    !pdfParseData ||
    pdfParseData.length <= 0 ||
    pdfParseData.match(/^\s*$/) !== null
  ) {
    res = "-1_-1_Documento_NoCategorizado";
  } else {
    res = fnGetClassifyData(pdfParseData);
  }
  return res;
}

// Extract classification and categorization using IA Natural for folder
async function fnOcrExtractClassifyFolders(
  folderPath,
  idClassifyTypeFile,
  idElementClassify,
  nameClassifyTypeFile,
  shortnameTypeFile
) {
  try {
    if (!existsSync(folderPath)) {
      logger.info(`The folder '${folderPath}' dont exist.`);
      return;
    }

    let date_time = new Date().toISOString().replace(/:/g, "-");

    // Read files by folder
    const archivos = readdirSync(folderPath);

    for (const archivo of archivos) {
      const rutaCompleta = join(folderPath, archivo);

      // Check if it is a file and has a .pdf extension
      if (
        lstatSync(rutaCompleta).isFile() &&
        extname(archivo).toLowerCase() === ".pdf"
      ) {
        try {
          logger.info(`Working file: ${rutaCompleta}`);
          let pdfParseData = await fnOcrEDR(rutaCompleta); // Send folder path to OCR
          if (
            !pdfParseData ||
            pdfParseData.length <= 0 ||
            pdfParseData.match(/^\s*$/) !== null
          ) {
            // null file or error read file
            logger.warn(`File error or null data '${rutaCompleta}'`);
          } else {
            logger.info("Send sample to IA: " + rutaCompleta);
            // Send IA Sample (plain text / Classification catalog)
            readDataSamples(
              pdfParseData,
              `${idClassifyTypeFile}_${idElementClassify}_${nameClassifyTypeFile}_${shortnameTypeFile}`
            );
            // Write / Save Sample in Samples Folder
            let fileSampleName =
              `${idClassifyTypeFile}_${idElementClassify}_${nameClassifyTypeFile}_${shortnameTypeFile}` +
              "_" +
              (await fnRemoveExtensionFile(archivo)) +
              "_" +
              date_time +
              ".txt";
            writeFileSync(
              await fnReturnSamplesFolderPath(fileSampleName),
              pdfParseData
            );
            // Write / Save Sample in custom json
            await fnSaveCustomSamplesInJSON(
              await fnReturnCustomSamplesFolderPath("customSamples.json"),
              idClassifyTypeFile,
              idElementClassify,
              nameClassifyTypeFile,
              shortnameTypeFile,
              fileSampleName,
              date_time
            );
          }
        } catch (error) {
          logger.error(`Error processing '${rutaCompleta}' : ${error}`);
        }
      }
    }
    // save ia classifications
    await fnTrainingDataIA();
    logger.info("Task classify folder complete.");
  } catch (error) {
    logger.error(`fnOcrExtractClassifyFolders error: : ${error}`);
  }
}

export {
  fnOcrEDR,
  fnOcrEDRPassword,
  fnOcrEDRegexv,
  fnOcrEDNextRegexv,
  fnOcrExtractClassify,
  fnOcrExtractClassifyFolders,
  fnOcrEDRFromWeb,
};

/*********************
25 = Products
2 = Documments
Example = 25_2_Flotillas_Chubb
Significa que es una producto(poliza) (1), de Flotillas Autos(2), Flotilla (Flotillas) de la aseguradora Chubb
Other Example = 2_33_cDom_Agua
Significa que es algo que entra en Documents (2), Otro tipo de documento (33), categorizado como comprobante de Domicilio (cDom), y del Agua
**********************
Catalogo de Samples
**********************
1 Catalogo de products (natural.classify.products.json)
2 Catalogo docs (natural.classify.docs.json)
**********************
**********************
Catalogo Docs
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
34  Comprobante de Domicilio
*********************/
