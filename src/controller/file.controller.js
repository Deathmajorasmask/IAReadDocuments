// Middleware load
const uploadFile = require("../middleware/upload");

// .env file
require("dotenv").config();

// File reader
const fs = require("fs");

// OCR Documment
const ocrData = require("./ocrfile.controller");

// AWS S3 Buckets
const AWS = require("aws-sdk");

// winston logs file config
const logger = require("../logs_module/logs.controller");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWSS3_ACCESS_KEYID,
  secretAccessKey: process.env.AWSS3_ACCESS_KEY,
});
const s3 = new AWS.S3();

const test = async (req, res) => {
  return res.status(200).send({
    status: 200,
    isRaw: true,
    body: {
      req: {
        message: "Happy Test :)",
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const seguTiendaSekuraUploadFile = async (req, res) => {
  try {
    const sentence = JSON.stringify(req.headers);
    const word = "multipart/form-data";
    if (!sentence.includes(word)) {
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req isn't multipart/form-data!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    await fnCreatePathFiles();
    await uploadFile(req, res);
    if (!req.body.id_user) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a id_user field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.id_product) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a id_product field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.docs_group) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a docs_group field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.abbr_folder) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a abbr_folder field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (req.file == undefined) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please upload a file!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const fileContent = await ocrData.fnOcrExtractData(req.file.originalname);
    logger.info(`fileContent of ocrExtractData: ${fileContent}`);
    const fileClassify = await ocrData.fnOcrExtractClassify(
      req.file.originalname
    );
    logger.info(`fileClassify of ocrExtractClassify: ${fileClassify}`);

    let arrClassifyNatural = fileClassify.split(/_/);
    // get current date
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    let milliseconds = date_time.getMilliseconds();
    let customDate = year + month + date;

    if (req.body.date) {
      customDate = req.body.date;
    }
    if (arrClassifyNatural[0] == "1" && !req.body.docs_type) {
      arrClassifyNatural[1] = "25";
    }
    if (req.body.docs_type) {
      arrClassifyNatural[1] = req.body.docs_type;
    }

    // configuring parameters
    let params = {
      Bucket: process.env.AWSS3_ACCESS_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `${req.body.abbr_folder}/users/${req.body.id_user}_${req.body.id_product}_${arrClassifyNatural[1]}_${req.body.docs_group}_${customDate}.pdf`,
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
        removeFile = fnRemoveAsyncFile(req.file.path);
        logger.info(`Uploaded in: ${data.Location}`);
      }
    });

    res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          id_user: req.body.id_user,
          id_product: req.body.id_product,
          docs_type: req.body.docs_type,
          docs_group: req.body.docs_group,
          timestamp: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          abbr_folder: req.body.abbr_folder,
          url: `${req.body.abbr_folder}/users/${req.body.id_user}_${req.body.id_product}_${arrClassifyNatural[1]}_${req.body.docs_group}_${customDate}.pdf`,
          url_bucket: `https://resio.s3.amazonaws.com/${req.body.abbr_folder}/users/${req.body.id_user}_${req.body.id_product}_${arrClassifyNatural[1]}_${req.body.docs_group}_${customDate}.pdf`,
          ocrdoc_classify:
            arrClassifyNatural[0] +
            "_" +
            arrClassifyNatural[1] +
            "_" +
            arrClassifyNatural[2] +
            "_" +
            arrClassifyNatural[3],
          message: "Uploaded the file successfully: " + req.file.path,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    logger.error(`Error seguTiendaSekuraUploadFile: ${err}`);

    if (err.code == "LIMIT_FILE_SIZE") {
      res.status(500).send({
        status: 500,
        isRaw: true,
        body: {
          req: {
            message: "File size cannot be larger!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    res.status(500).send({
      status: 500,
      isRaw: true,
      body: {
        req: {
          message: `Could not upload the file: ${req.file.originalname}. Error: ${err}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

async function fnRemoveAsyncFile(dirPathDoc) {
  try {
    fs.unlinkSync(dirPathDoc);
    return true;
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
}

async function fnCreatePathFiles() {
  if (fs.existsSync(__basedir + "/resources/static/assets/uploads")) {
    console.log("Create Path");
  } else {
    fs.mkdirSync("./resources/static/assets/uploads", { recursive: true });
  }
}

module.exports = {
  seguTiendaSekuraUploadFile,
  test,
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
