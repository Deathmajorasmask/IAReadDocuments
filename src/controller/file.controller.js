const uploadFile = require("../middleware/upload");

// .env file
require("dotenv").config();

// File reader
const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";

// Generate UID for Users Documents
const { v4: uuidv4 } = require("uuid");

// OCR Documment
const ocrData = require("./ocrfile.controller");

// AWS S3 Buckets
const AWS = require("aws-sdk");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWSS3_ACCESS_KEYID,
  secretAccessKey: process.env.AWSS3_ACCESS_KEY,
});
const s3 = new AWS.S3();

// reSIO database controller
const reSIODBQuerys = require("./reSIO.query.controller");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    let idUnic = uuidv4();
    console.log("El id único es: ", idUnic);

    const Variable = await ocrData.fnOcrExtractData(req.file.originalname);

    // Seach user by tuid
    let userInfo = await reSIODBQuerys.fnSearchUserInfoByTuid('9581447934793'); // 9581447934793 // Maza 1950918133558
    console.log("TUID resultado de la busqueda de PG: "+ userInfo.body.uid);

    // configuring parameters
    var params = {
      Bucket: "resio",
      Body: fs.createReadStream(req.file.path),
      Key: `QA/users/${userInfo.body.uid}-${req.file.path}`,
    };

    // Aws S3 Bucket Upload File
    /* s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        console.log("Uploaded in:", data.Location);
      }
    }); */

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.path,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  remove,
  removeSync,
};

/**
File Upload method, we will export upload() function that:
– use middleware function for file upload
– catch Multer error (in middleware function)
– return response with message

For File Information and Download:
– getListFiles(): read all files in uploads folder, return list of files’ information (name, url)
– download(): receives file name as input parameter, then uses Express res.download API to transfer the file at path (directory + file name) as an ‘attachment’.

– We call middleware function uploadFile() first.
– If the HTTP request doesn’t include a file, send 400 status in the response.
– We also catch the error and send 500 status with error message.
 */
