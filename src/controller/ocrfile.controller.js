const { ocrSpace } = require('ocr-space-api-wrapper');

async function fnOcrExtractData(dirPathDoc){
    let res1 = await ocrSpace( __basedir + "/resources/static/assets/uploads/" + dirPathDoc);
    console.log(res1)
    return res1
}

module.exports = {
    fnOcrExtractData
};