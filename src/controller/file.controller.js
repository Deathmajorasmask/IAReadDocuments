// Middleware load
import uploadFile from "../middleware/upload.js";

// OCR Documment
import {
  fnOcrEDR,
  fnOcrEDRPassword,
  fnOcrEDRegexv,
  fnOcrEDNextRegexv,
  fnOcrExtractData,
  fnOcrExtractClassify,

} from "./ocrfile.controller.js";

// File Utils
import {
  fnRemoveAsyncFile,
  fnCreatePathFiles,
} from "./file.utils.controller.js";

// AWS S3 Module
import { aws3BucketUploadPDF } from "./s3bucket.controller.js";

// winston logs file config
import logger from "../logs_module/logs.controller.js";

const test = async (req, res) => {
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
    if (req.file == undefined || req.file == "") {
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
    const fileClassify = await fnOcrExtractClassify(req.file.originalname);
    logger.info(`fileClassify of ocrExtractClassify: ${fileClassify}`);
    const fileContentDataReader = await fnOcrEDR(req.file.originalname);
    logger.info(JSON.stringify(fileContentDataReader));

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
    
    await aws3BucketUploadPDF(
      process.env.AWSS3_ACCESS_BUCKET,
      req.file.path,
      `${req.body.abbr_folder}/users/${req.body.id_user}_${req.body.id_product}_${arrClassifyNatural[1]}_${req.body.docs_group}_${customDate}.pdf`
    );

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
          message: `Could not upload the file. Error: ${err}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
      let removeFile = fnRemoveAsyncFile(req.file.path);
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
    if (req.file == undefined || req.file == "") {
      let removeFile = fnRemoveAsyncFile(req.file.path);
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

    const fileClassify = await fnOcrExtractClassify(req.file.originalname);
    logger.info(`fileClassify of ocrExtractClassify: ${fileClassify}`);
    const fileContentDataReader = await fnOcrExtractDataReader(
      req.file.originalname
    );
    logger.info(JSON.stringify(fileContentDataReader));

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

    await aws3BucketUploadPDF(
      process.env.AWSS3_ACCESS_BUCKET,
      req.file.path,
      `${req.body.abbr_folder}/users/${req.body.id_user}_${req.body.id_product}_${arrClassifyNatural[1]}_${req.body.docs_group}_${customDate}.pdf`
    );

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
          message: `Could not upload the file. Error: ${err}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export { seguTiendaSekuraUploadFile, test };

/**
File Upload method, we will export upload() function that:
– use middleware function for file upload
– catch Multer error (in middleware function)
– return response with message

– We call middleware function uploadFile() first.
– If the HTTP request doesn’t include a file, send 400 status in the response.
– We also catch the error and send 500 status with error message.
 */
