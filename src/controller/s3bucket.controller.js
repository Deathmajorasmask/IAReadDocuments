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
  let pathUploadFile = await fnS3UploadFileBucket(params, options, filePath);
  return pathUploadFile;
}

async function aws3BucketUploadPNG(accessBucket, filePath, pathKeyBucket) {
  // configuring parameters
  let params = {
    Bucket: accessBucket,
    Body: createReadStream(filePath),
    Key: pathKeyBucket,
    ContentType: "image/png",
  };

  let options = {
    headers: {
      "Content-Type": "image/png",
    },
  };

  let pathUploadFile = await fnS3UploadFileBucket(params, options, filePath);
  return pathUploadFile;
}

async function aws3BucketUploadJPG(accessBucket, filePath, pathKeyBucket) {
  // configuring parameters
  let params = {
    Bucket: accessBucket,
    Body: createReadStream(filePath),
    Key: pathKeyBucket,
    ContentType: "image/jpeg",
  };

  let options = {
    headers: {
      "Content-Type": "image/jpeg",
    },
  };

  let pathUploadFile = await fnS3UploadFileBucket(params, options, filePath);
  return pathUploadFile;
}

async function fnS3UploadFileBucket(params, options, filePath) {
  return new Promise((resolve, reject) => {
    // Aws S3 Bucket Upload File
    s3.upload(params, options, function (err, data) {
      //handle error
      if (err) {
        logger.error(`Error S3: ${err}`);
        reject(err);
      }

      //success
      if (data) {
        fnRemoveAsyncFile(filePath);
        logger.info(`Uploaded in: ${data.Location}`);
        resolve(data.Location);
      }
    });
  });
}

export { aws3BucketUploadPDF, aws3BucketUploadPNG, aws3BucketUploadJPG };
