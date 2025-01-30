// Middleware load
import uploadFile from "../middleware/upload.js";
import uploadFiles from "../middleware/uploadMultiple.js";

// PDF to Image
import { fnPdfToImage } from "./pdfFilesToImages.controller.js";

// OCR Documment
import {
  fnOcrEDR,
  fnOcrEDRPassword,
  fnOcrEDRegexv,
  fnOcrEDNextRegexv,
  fnOcrExtractClassify,
  fnOcrExtractClassifyFolders,
  fnOcrEDRFromWeb,
} from "./ocrfile.controller.js";

// OCR Tesseract
import {
  TesseractRFWorker,
  TesseractRFPDF,
  TesseractRFSpecial,
} from "./ocrTesseract.controller.js";

// File Utils
import {
  fnReturnSamplesFolderPath,
  fnReturnUploadFolderPath,
  fnRemoveAsyncFile,
  fnRemoveAsyncFolder,
  fnRemoveAsyncFilesOfFolder,
  fnReadExtensionFile,
  fnReturnExcelFilesFolderPath,
  fnReturnDowloadS3BucketFolderPath,
} from "./file.utils.controller.js";

// AWS S3 Module
import {
  aws3BucketDowloadFile,
  aws3BucketDowloadFolder,
  aws3BucketUploadPDF,
} from "./s3bucket.controller.js";

import {
  fnTestWithObjSchema,
  fnTestWithDataColumns,
  fnWriteXLSXWithObjSchema,
  fnWriteXLSXWithSheetsObjSchema,
  fnAppendObjectToFileWithHeader,
  isValidNewObjects,
} from "./write.excel.file.controller.js";

// winston logs file config
import logger from "../logs_module/logs.controller.js";

// Generic Reponses
import {
  validateFieldWithoutResponse,
  validateHeadersResponse,
} from "./file.responses.utils.controller.js";
import { fnSearchAdvanceRegexJSON } from "./file.advance.search.controler.js";

// Send samples endpoint by AWS S3Bucket
const uploadFolderToSample = async (req, res) => {
  await uploadFile(req, res);
  // Array to store errors
  let validationErrors = [];

  // Validate fields
  await validateFieldWithoutResponse(
    req.body.folderPathS3Bucket,
    "folderPathS3Bucket",
    validationErrors
  );
  await validateFieldWithoutResponse(
    req.body.idClassifyTypeFile,
    "idClassifyTypeFile",
    validationErrors
  );
  await validateFieldWithoutResponse(
    req.body.idElementClassify,
    "idElementClassify",
    validationErrors
  );
  await validateFieldWithoutResponse(
    req.body.nameClassifyTypeFile,
    "nameClassifyTypeFile",
    validationErrors
  );
  await validateFieldWithoutResponse(
    req.body.shortnameTypeFile,
    "shortnameTypeFile",
    validationErrors
  );

  // If there are errors, send a response with all the accumulated errors
  if (validationErrors.length > 0) {
    return res.status(400).send({
      status: 400,
      isRaw: true,
      body: {
        errors: validationErrors,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // If validations are successful, call all other functions
  try {
    await aws3BucketDowloadFolder(
      process.env.AWSS3_ACCESS_BUCKET,
      req.body.folderPathS3Bucket, // folderPathS3Bucket
      await fnReturnDowloadS3BucketFolderPath("")
    );

    await fnOcrExtractClassifyFolders(
      await fnReturnDowloadS3BucketFolderPath(""),
      req.body.idClassifyTypeFile, // idClassifyTypeFile
      req.body.idElementClassify, // idElementClassify
      req.body.nameClassifyTypeFile, // nameClassifyTypeFile
      req.body.shortnameTypeFile // shortnameTypeFile
    );

    await fnRemoveAsyncFolder(await fnReturnDowloadS3BucketFolderPath(""));

    return res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          folderPathS3Bucket: req.body.folderPathS3Bucket,
          idClassifyTypeFile: req.body.idClassifyTypeFile,
          idElementClassify: req.body.idElementClassify,
          nameClassifyTypeFile: req.body.nameClassifyTypeFile,
          shortnameTypeFile: req.body.shortnameTypeFile,
          message: `Classification has been done successfully`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handling uploadFolderToSample errors
    logger.error(`Error interno del servidor: ${error}`);
    return res.status(500).send({
      status: 500,
      message: `Error interno del servidor: ${error}`,
    });
  }
};

const sendFileToAnalysis = async (req, res) => {
  await uploadFile(req, res);
  // Array to store errors
  let validationErrors = [];

  // Validate fields
  await validateFieldWithoutResponse(req.file, "file", validationErrors);
  await validateHeadersResponse(
    req.headers,
    "multipart/form-data",
    validationErrors
  );

  // If there are errors, send a response with all the accumulated errors
  if (validationErrors.length > 0) {
    return res.status(400).send({
      status: 400,
      isRaw: true,
      body: {
        errors: validationErrors,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // If validations are successful, call all other functions
  try {
    let fileClassify = await fnOcrExtractClassify(
      await fnReturnUploadFolderPath(req.file.originalname)
    );
    logger.info(`fileClassify of ocrExtractClassify: ${fileClassify}`);
    let dataFoundFile = await fnSearchAdvanceRegexJSON(
      fileClassify,
      await fnReturnUploadFolderPath(req.file.originalname)
    );

    // Check that data exists in the file search
    if (!(await isValidNewObjects(dataFoundFile))) {
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: `The analysis could not be completed.`,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let schema = [
      {
        column: "Key",
        type: String,
        value: (dataFileOCR) => dataFileOCR.key,
        getCellStyle: (dataFileOCR) => {
          return {
            align: "left",
            width: 60,
          };
        },
      },
      {
        column: "Key substract",
        type: String,
        value: (dataFileOCR) => dataFileOCR.regex,
        getCellStyle: (dataFileOCR) => {
          return {
            align: "left",
            width: 60,
          };
        },
      },
      {
        column: "Value",
        type: String,
        value: (dataFileOCR) => dataFileOCR.result,
        getCellStyle: (dataFileOCR) => {
          return {
            align: "left",
            width: 60,
          };
        },
      },
    ];

    // Add Header file
    let newElementHeader = {
      key: "Classify",
      regex: "",
      result: fileClassify,
    };

    // Agregar al array
    dataFoundFile.push(newElementHeader);

    await fnWriteXLSXWithObjSchema(
      dataFoundFile,
      schema,
      "Sheet Analisys",
      await fnReturnExcelFilesFolderPath("test-schema.xlsx")
    );

    // Save to TXT file
    await fnAppendObjectToFileWithHeader(
      await fnReturnExcelFilesFolderPath("archivoResultadosSingle.txt"),
      dataFoundFile,
      `seClassifyDocument: ${fileClassify}`
    );
    await fnAppendObjectToFileWithHeader(
      await fnReturnExcelFilesFolderPath("archivoResultadosSingleLocal.txt"),
      dataFoundFile,
      `seClassifyDocument: ${fileClassify}`
    );
    // Upload to S3 Bucket
    let filePathS3 = await aws3BucketUploadPDF(
      process.env.AWSS3_ACCESS_BUCKET,
      req.file.path,
      `OKULAR/FILES_UPLOAD/${fileClassify}/${req.file.originalname}`
    );
    let fileAnalisysPathS3 = await aws3BucketUploadPDF(
      process.env.AWSS3_ACCESS_BUCKET,
      await fnReturnExcelFilesFolderPath("archivoResultadosSingle.txt"),
      `OKULAR/ANALISYS_REPORTS/archivoResultadosSingle.pdf`
    );
    return res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          fileClassify: fileClassify,
          url_bucket_file: filePathS3,
          url_bucket_analisys: fileAnalisysPathS3,
          message: `Analysis has been done successfully`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handling uploadFolderToSample errors
    logger.error(`Internal Server Error: ${error}`);
    return res.status(500).send({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
};

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
    await uploadFile(req, res);
    // await uploadFiles(req, res);
    // console.log(req.files[0].originalname);
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

    const fileClassify = await fnOcrExtractClassify(
      await fnReturnUploadFolderPath(req.file.originalname)
    );
    logger.info(`fileClassify of ocrExtractClassify: ${fileClassify}`);
    /* const fileContentDataReader = await fnOcrEDRFromWeb(
      "https://raw.githubusercontent.com/adrienjoly/npm-pdfreader/master/test/sample.pdf"
    ); */
    /* const fileContentDataReader = await fnPdfToImage();
    logger.info(JSON.stringify(fileContentDataReader)); */

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
    /* if (arrClassifyNatural[0] == "1" && !req.body.docs_type) {
      arrClassifyNatural[1] = "25";
    } */
    if (req.body.docs_type) {
      arrClassifyNatural[1] = req.body.docs_type;
    }

    let filePathS3 = await aws3BucketUploadPDF(
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
          url_bucket: filePathS3,
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
    logger.error(`Error TestEndpoint: ${err}`);

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

const otherTest = async (req, res) => {
  try {
    let objects = [
      {
        name: "David Hdz",
        age: 1800,
        dateOfBirth: new Date(),
        graduated: true,
      },
      {
        name: "Jairo Lope",
        age: 2600.5,
        dateOfBirth: new Date(),
        graduated: false,
      },
      {
        name: "Aldo Saucedo",
        age: 2800.6,
        dateOfBirth: new Date(),
        graduated: true,
      },
    ];

    let schema = [
      {
        column: "Name",
        type: String,
        value: (student) => student.name,
        getCellStyle: (student) => {
          return {
            align: "right",
            width: 20,
          };
        },
      },
      {
        column: "Cost",
        type: Number,
        format: "#,##0.00",
        width: 12,
        align: "center",
        value: (student) => student.age,
      },
      {
        column: "Date of Birth",
        type: Date,
        format: "mm/dd/yyyy",
        value: (student) => student.dateOfBirth,
      },
      {
        column: "Graduated",
        type: Boolean,
        value: (student) => student.graduated,
      },
    ];

    await fnWriteXLSXWithObjSchema(
      objects,
      schema,
      "Sheet One",
      await fnReturnExcelFilesFolderPath("test-schema.xlsx")
    );

    await fnWriteXLSXWithSheetsObjSchema(
      [objects, objects],
      [schema, schema],
      ["Sheet One", "Sheet Two"],
      await fnReturnExcelFilesFolderPath("testSheets-schema.xlsx")
    );

    res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          url_bucket: "hola",
          message: "Uploaded the file successfully: " + "filePathS3",
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    logger.error(`Error TestEndpoint: ${err}`);

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

export { test, otherTest, uploadFolderToSample, sendFileToAnalysis };

/**
File Upload method, we will export upload() function that:
– use middleware function for file upload
– catch Multer error (in middleware function)
– return response with message

– We call middleware function uploadFile() first.
– If the HTTP request doesn’t include a file, send 400 status in the response.
– We also catch the error and send 500 status with error message.
 */
