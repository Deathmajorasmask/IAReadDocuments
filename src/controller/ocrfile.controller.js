const { ocrSpace } = require('ocr-space-api-wrapper');

async function fnOcrExtractData(dirPathDoc){
    const res1 = await ocrSpace( __basedir + "/resources/static/assets/uploads/" + dirPathDoc);
    console.log("Entro aquiiiii")
    console.log(res1)
    return res1
}

module.exports = {
    fnOcrExtractData
};