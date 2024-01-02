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
