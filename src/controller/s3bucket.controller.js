// File Utils
import { fnRemoveAsyncFile } from "./file.utils.controller.js";

// File reader
import { createReadStream } from "fs";

// AWS S3 Buckets
import pkg from "aws-sdk";
const { config, S3 } = pkg;

// winston logs file config
import logger from "../logs_module/logs.controller.js";

//configuring the AWS environment
config.update({
  accessKeyId: process.env.AWSS3_ACCESS_KEYID,
  secretAccessKey: process.env.AWSS3_ACCESS_KEY,
});
const s3 = new S3();

async function aws3BucketUploadPDF(accessBucket, filePath, pathKeyBucket) {
  // configuring parameters
  let params = {
    Bucket: accessBucket,
    Body: createReadStream(filePath),
    Key: pathKeyBucket,
    //ACL: 'public-read',
    ContentType: "application/pdf",
  };

  const options = {
    headers: {
      "Content-Type": "application/pdf",
    },
  };

  // Aws S3 Bucket Upload File
  s3.upload(params, options, function (err, data) {
    //handle error
    if (err) {
      logger.error(`Error S3: ${err}`);
    }

    //success
    if (data) {
      let removeFile = fnRemoveAsyncFile(filePath);
      logger.info(`Uploaded in: ${data.Location}`);
    }
  });
}

export {
  aws3BucketUploadPDF,
};