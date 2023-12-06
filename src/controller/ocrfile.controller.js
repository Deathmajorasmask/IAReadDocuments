const { ocrSpace } = require('ocr-space-api-wrapper');
const naturalfnController = require("./natural.controller");
const pdfParse = require("pdf-parse");

async function fnOcrExtractData(dirPathDoc){
    console.log("-----------ocrspace----------")
    let res1 = await ocrSpace( __basedir + "/resources/static/assets/uploads/" + dirPathDoc);
    console.log(res1)
    console.log("-----------End_ocrspace----------")

    console.log("-----------pdfParse----------")
    pdfParse(__basedir + "/resources/static/assets/uploads/" + dirPathDoc).then(result => {
        console.log(result.text)
        console.log("--------------NaturalClassify------------------")
        naturalfnController.fnGetClassifyData(result.text)
        console.log("--------------End_NaturalClassify------------------")
    })
    console.log("-----------End_pdfParse----------")
    return res1
}

module.exports = {
    fnOcrExtractData
};