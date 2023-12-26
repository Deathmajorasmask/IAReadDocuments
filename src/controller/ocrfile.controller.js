const { ocrSpace } = require("ocr-space-api-wrapper");
const naturalfnController = require("./natural.controller");
const pdfParse = require("pdf-parse");

async function fnOcrExtractData(dirPathDoc) {
  console.log("-----------ocrspace----------");
  let res = await ocrSpace(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  );
  console.log(res);
  console.log("-----------End_ocrspace----------");

  return res;
}

async function fnOcrExtractClassify(dirPathDoc) {
  let res;
  console.log("-----------pdfParse----------");
  pdfParse(__basedir + "/resources/static/assets/uploads/" + dirPathDoc).then(
    (result) => {
      console.log(result.text);
      console.log("--------------NaturalClassify------------------");
      if (
        !result.text ||
        result.text.length <= 0 ||
        result.text.match(/^\s*$/) !== null
      ) {
        console.log("Otro-Documento-NoCategorizado");
        res = "";
      } else {
        res = naturalfnController.fnGetClassifyData(result.text);
      }
      console.log("--------------End_NaturalClassify------------------");
    }
  );
  console.log("-----------End_pdfParse----------");
  return res;
}

module.exports = {
  fnOcrExtractData,
  fnOcrExtractClassify,
};
