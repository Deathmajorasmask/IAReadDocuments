//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWSS3_ACCESS_KEYID,
    secretAccessKey: process.env.AWSS3_ACCESS_KEY,
  });
  const s3 = new AWS.S3();
  
async function fnUploadS3Bucket(dirPathDoc) {
    return pdfParse(
      __basedir + "/resources/static/assets/uploads/" + dirPathDoc
    ).then((result) => {
      return result.text;
    });
  }