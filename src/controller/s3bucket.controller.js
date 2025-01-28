// File Utils
import { fnRemoveAsyncFile } from "./file.utils.controller.js";

// File reader
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";

// requiere path
import path from "path";

/* AWS S3 Buckets v2
Not update v3.
Unfortunately with v3 loading credentials using a JSON file is not supported anymore, though it is still valid using environment variables. */
import pkg from "aws-sdk";
const { config, S3 } = pkg;

// winston logs file config
import logger from "../logs_module/logs.controller.js";

// Dowload Files S3 Bucket
import { Readable } from "node:stream";

//configuring the AWS environment
config.update({
  accessKeyId: process.env.AWSS3_ACCESS_KEYID,
  secretAccessKey: process.env.AWSS3_ACCESS_KEY,
});
const s3 = new S3();

/**
 * Upload a file from local destination to an S3 bucket.
 * @param {string} accessBucket - Name of the S3 bucket.
 * @param {string} filePath - Local destination file path.
 * @param {string} pathKeyBucket - S3 object key (Bucket object path).
 * @returns {Promise<void>} A promise that is fulfilled when all files are downloaded.
 */
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

/**
 * Upload a file from local destination to an S3 bucket.
 * @param {string} accessBucket - Name of the S3 bucket.
 * @param {string} filePath - Local destination file path.
 * @param {string} pathKeyBucket - S3 object key (Bucket object path).
 * @returns {Promise<void>} A promise that is fulfilled when all files are downloaded.
 */
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

/**
 * Upload a file from local destination to an S3 bucket.
 * @param {string} accessBucket - Name of the S3 bucket.
 * @param {string} filePath - Local destination file path.
 * @param {string} pathKeyBucket - S3 object key (Bucket object path).
 * @returns {Promise<void>} A promise that is fulfilled when all files are downloaded.
 */
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

// Private function
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

/**
 * Download a file from an S3 bucket to a local destination.
 * @param {string} accessBucket - Name of the S3 bucket - process.env.AWSS3_ACCESS_BUCKET.
 * @param {string} destPath - Path of the local destination file - req.file.path.
 * @param {string} pathKeyBucket - S3 object key (Bucket object path) - basedir + "/src/documents/1667331533390.jpg".
 * @returns {Promise<void>} A promise that is fulfilled when all files are downloaded - "1667331533390.jpg".
 */
async function aws3BucketDowloadFile(accessBucket, destPath, pathKeyBucket) {
  let params = {
    Bucket: accessBucket,
    Key: pathKeyBucket,
  };

  try {
    const download_ = await s3.getObject(params).promise();
    Readable.from(download_.Body).pipe(createWriteStream(destPath));
    logger.info(`File downloaded successfully in ${destPath}`);
    return destPath;
  } catch (e) {
    logger.error("Error downloading file", e);
    throw e; // Throw error
  }
}

/**
 * Download all files in a specific folder from an S3 bucket.
 * @param {string} accessBucket - Name of the S3 bucket.
 * @param {string} folderPath - Path of the folder in the S3 bucket.
 * @param {string} localFolder - Local folder where the files are saved.
 * @returns {Promise<void>} A promise that is fulfilled when all files are downloaded.
 */
async function aws3BucketDowloadFolder(accessBucket, folderPath, localFolder) {
  const params = {
    Bucket: accessBucket,
    Prefix: folderPath.endsWith("/") ? folderPath : folderPath + "/",
  };

  try {
    const list = await s3.listObjectsV2(params).promise();
    const files = list.Contents || [];

    if (files.length === 0) {
      logger.warn(`No files found in the folder ${folderPath}.`);
      return;
    }

    // Create local folder if it doesn't exist
    if (!existsSync(localFolder)) {
      mkdirSync(localFolder, { recursive: true });
    }

    // Download each file
    for (const file of files) {
      const fileName = path.basename(file.Key);
      const destPath = path.join(localFolder, fileName);

      logger.info(`Dowload file ${file.Key} to ${destPath}...`);
      await aws3BucketDowloadFile(accessBucket, destPath, file.Key);
    }

    logger.info("All files were downloaded successfully.");
    // return destPath;
  } catch (e) {
    logger.error("Error downloading folder", e);
    throw e; // Throw error
  }
}

export {
  aws3BucketUploadPDF,
  aws3BucketUploadPNG,
  aws3BucketUploadJPG,
  aws3BucketDowloadFile,
  aws3BucketDowloadFolder,
};
