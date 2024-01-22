// Middleware load
const uploadFile = require("../middleware/upload");

// .env file
require("dotenv").config();

// File reader
const fs = require("fs");

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
    await fnCreatePathFiles();
    await uploadFile(req, res);
    if (!req.body.doc_group_id) {
      return res
        .status(400)
        .send({ message: "Please req a doc_group_id field!" });
    }
    if (!req.body.contract_id) {
      return res
        .status(400)
        .send({ message: "Please req a contract_id field!" });
    }
    if (!req.body.owner_user_tuid) {
      return res
        .status(400)
        .send({ message: "Please req a owner_user_tuid field!" });
    }
    if (!req.body.owner_org_toid) {
      return res
        .status(400)
        .send({ message: "Please req a owner_org_toid field!" });
    }
    if (!req.body.owner_office_id) {
      req.body.owner_office_id = null;
    }
    if (!req.body.expired_at) {
      return res
        .status(400)
        .send({ message: "Please req a expired_at field!" });
    }
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    /* let idUnic = uuidv4();
    console.log("El id único es: ", idUnic); */

    const fileContent = await ocrData.fnOcrExtractData(req.file.originalname);
    const fileClassify = await ocrData.fnOcrExtractClassify(
      req.file.originalname
    );

    // Seach user by tuid
    console.log("el request de tuid: " + req.body.owner_user_tuid);
    let userInfo = await reSIODBQuerys.fnSearchUserInfoByTuid(
      req.body.owner_user_tuid
    ); // 9998797483398 // Maza 1950918133558

    // Search org id for owner_org_toid (doc - owner_org_toid -> org - tuid)
    let orgInfo = await reSIODBQuerys.fnSearchOrgsInfoByToid(
      req.body.owner_org_toid
    );

    // Create fields to DB reSIO
    let isactive = true;
    let isvalid = true;
    let isreviewed = false;
    let arrClassifyNatural = fileClassify.split(/_/); //split(/_ ¡|! ¿|[?]/);//split(/_/);
    // get current date
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    /* // get current hours
    let hours = date_time.getHours();
    // get current minutes
    let minutes = date_time.getMinutes();
    // get current seconds
    let seconds = date_time.getSeconds();
    // get current milliseconds
    let milliseconds = date_time.getMilliseconds(); */
    let typeIdDoc = "";
    if (arrClassifyNatural[0] == "1") {
      typeIdDoc = "25";
    } else {
      typeIdDoc = arrClassifyNatural[1];
    }

    // Add Document in DB reSIO
    let documentInfo = await reSIODBQuerys.fnCreateDocumentToDB(
      `Poliza ${arrClassifyNatural[2]} ${arrClassifyNatural[3]}`,
      req.body.doc_group_id,
      typeIdDoc,
      req.body.contract_id,
      `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      isvalid,
      isreviewed,
      isactive,
      userInfo.body.id,
      orgInfo.body.id,
      req.body.owner_office_id,
      req.body.expired_at.toString()
      /*       `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
      `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00` */
    );
    console.log(documentInfo);

    if (!fileContent.IsErroredOnProcessing) {
      // Save in reSIO data for pdf file
      console.log("reSIO Data for pdf file");
      console.log(fileContent.ParsedResults[0].ParsedText);
    }

    // configuring parameters
    var params = {
      Bucket: process.env.AWSS3_ACCESS_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
    };

    // Aws S3 Bucket Upload File
    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        console.log("Ruta de archivo a borrar: " + req.file.path);
        removeFile = fnRemoveAsyncFile(req.file.path);
        console.log("Uploaded in:", data.Location);
      }
    });

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

const test = async (req, res) => {
  console.log(JSON.stringify(req.headers));
  const sentence = JSON.stringify(req.headers);
  const word = 'multipart/form-data';
  if(sentence.includes(word)){
    console.log("Si es multipart");
  }
  else{
    console.log("NO NO");
  }
  res.status(200).send({
    status: 200,
    isRaw: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const aerContUpload = async (req, res) => {
  try {
    await fnCreatePathFiles();
    await uploadFile(req, res);
    if (!req.body.doc_group_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a doc_group_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.contract_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a contract_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_user_tuid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_user_tuid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_org_toid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_org_toid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_office_id || req.body.owner_office_id == "null") {
      req.body.owner_office_id = null;
    }
    if (!req.body.expired_at) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a expired_at field!",
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
    console.log(fileContent);
    const fileClassify = await ocrData.fnOcrExtractClassify(
      req.file.originalname
    );

    // Seach user by tuid
    console.log("el request de tuid: " + req.body.owner_user_tuid);
    let userInfo = await reSIODBQuerys.fnSearchUserInfoByTuid(
      req.body.owner_user_tuid
    ); // 9998797483398 // Maza 1950918133558

    // Search org id for owner_org_toid (doc - owner_org_toid -> org - tuid)
    let orgInfo = await reSIODBQuerys.fnSearchOrgsInfoByToid(
      req.body.owner_org_toid
    );

    // Create fields to DB reSIO
    let isactive = true;
    let isvalid = true;
    let isreviewed = false;
    let arrClassifyNatural = fileClassify.split(/_/); //split(/_ ¡|! ¿|[?]/);//split(/_/);
    // get current date
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = date_time.getHours();
    // get current minutes
    let minutes = date_time.getMinutes();
    // get current seconds
    let seconds = date_time.getSeconds();
    // get current milliseconds
    let milliseconds = date_time.getMilliseconds();

    let typeIdDoc = "";
    if (arrClassifyNatural[0] == "1") {
      typeIdDoc = "25";
    } else {
      typeIdDoc = arrClassifyNatural[1];
    }

    // Add Document in DB reSIO
    let documentInfo = await reSIODBQuerys.fnCreateDocumentToDB(
      `Poliza ${arrClassifyNatural[2]} ${arrClassifyNatural[3]}`,
      req.body.doc_group_id,
      typeIdDoc,
      req.body.contract_id,
      `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      isvalid,
      isreviewed,
      isactive,
      userInfo.body.id,
      orgInfo.body.id,
      req.body.owner_office_id,
      req.body.expired_at.toString()
    );
    console.log(documentInfo);

    if (!fileContent.IsErroredOnProcessing) {
      // Save in reSIO data for pdf file
      console.log("reSIO Data for pdf file");
      console.log(fileContent.ParsedResults[0].ParsedText);
    } else {
      // Error in pdf file
      // Se usara provisionalmente
      let numPaginas = fileContent.ParsedResults.length;
      for (j = 0; j < numPaginas; j++) {}
      console.log(fileContent.ParsedResults[0].ParsedText);
    }

    // configuring parameters
    var params = {
      Bucket: process.env.AWSS3_ACCESS_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
    };

    // Aws S3 Bucket Upload File
    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        removeFile = fnRemoveAsyncFile(req.file.path);
        console.log("Uploaded in:", data.Location);
      }
    });

    res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          id: documentInfo.body.req.id,
          name: documentInfo.body.req.name,
          doc_group_id: documentInfo.body.req.doc_group_id,
          doc_type_id: documentInfo.body.req.doc_type_id,
          contract_id: documentInfo.body.req.contract_id,
          url: documentInfo.body.req.url,
          isvalid: documentInfo.body.req.isvalid,
          isreviewed: documentInfo.body.req.isreviewed,
          isactive: documentInfo.body.req.isactive,
          owner_user_id: documentInfo.body.req.owner_user_id,
          owner_org_id: documentInfo.body.req.owner_org_id,
          owner_office_id: documentInfo.body.req.owner_office_id,
          expired_at: documentInfo.body.req.expired_at,
          created_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          modified_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          ocrDocClassify: fileClassify,
          message: "Uploaded the file successfully: " + req.file.path,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);

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
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

const tndSegUploadBucket = async (req, res) => {
  try {
    const sentence = JSON.stringify(req.headers);
    const word = 'multipart/form-data';
    if(!(sentence.includes(word))){
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
    if (!req.body.doc_group_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a doc_group_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.contract_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a contract_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_user_tuid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_user_tuid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_org_toid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_org_toid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_office_id || req.body.owner_office_id == "null") {
      req.body.owner_office_id = null;
    }
    if (!req.body.expired_at) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a expired_at field!",
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
    console.log(fileContent);
    const fileClassify = await ocrData.fnOcrExtractClassify(
      req.file.originalname
    );

    // Seach user by tuid
    console.log("el request de tuid: " + req.body.owner_user_tuid);
    let userInfo = await reSIODBQuerys.fnSearchUserInfoByTuid(
      req.body.owner_user_tuid
    ); // 9998797483398 // Maza 1950918133558

    // Search org id for owner_org_toid (doc - owner_org_toid -> org - tuid)
    let orgInfo = await reSIODBQuerys.fnSearchOrgsInfoByToid(
      req.body.owner_org_toid
    );

    // Create fields to DB reSIO
    let isactive = true;
    let isvalid = true;
    let isreviewed = false;
    let arrClassifyNatural = fileClassify.split(/_/); //split(/_ ¡|! ¿|[?]/);//split(/_/);
    // get current date
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = date_time.getHours();
    // get current minutes
    let minutes = date_time.getMinutes();
    // get current seconds
    let seconds = date_time.getSeconds();
    // get current milliseconds
    let milliseconds = date_time.getMilliseconds();

    if (arrClassifyNatural[0] == "1") {
      arrClassifyNatural[1] = "25";
    } 

    // Add Document in DB reSIO
    let documentInfo = await reSIODBQuerys.fnCreateDocumentToDB(
      `Poliza ${arrClassifyNatural[2]} ${arrClassifyNatural[3]}`,
      req.body.doc_group_id,
      arrClassifyNatural[1],
      req.body.contract_id,
      `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${arrClassifyNatural[1]}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      isvalid,
      isreviewed,
      isactive,
      userInfo.body.id,
      orgInfo.body.id,
      req.body.owner_office_id,
      req.body.expired_at.toString()
    );
    console.log(documentInfo);

    // configuring parameters
    var params = {
      Bucket: process.env.AWSS3_ACCESS_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      //ACL: 'public-read',
      ContentType: "application/pdf"
    };

    const options = {
      headers: {
        'Content-Type': 'application/pdf'
      }
    };

    // Aws S3 Bucket Upload File
    s3.upload(params, options, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        removeFile = fnRemoveAsyncFile(req.file.path);
        console.log("Uploaded in:", data.Location);
      }
    });

    res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          id: documentInfo.body.req.id,
          name: documentInfo.body.req.name,
          doc_group_id: documentInfo.body.req.doc_group_id,
          doc_type_id: documentInfo.body.req.doc_type_id,
          contract_id: documentInfo.body.req.contract_id,
          url: documentInfo.body.req.url,
          isvalid: documentInfo.body.req.isvalid,
          isreviewed: documentInfo.body.req.isreviewed,
          isactive: documentInfo.body.req.isactive,
          owner_user_id: documentInfo.body.req.owner_user_id,
          owner_org_id: documentInfo.body.req.owner_org_id,
          owner_office_id: documentInfo.body.req.owner_office_id,
          expired_at: documentInfo.body.req.expired_at,
          created_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          modified_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          ocrDocClassify: fileClassify,
          message: "Uploaded the file successfully: " + req.file.path,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);

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
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

const seguTiendaSekuraUploadBucket = async (req, res) => {
  try {
    const sentence = JSON.stringify(req.headers);
    const word = 'multipart/form-data';
    if(!(sentence.includes(word))){
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
    if (!req.body.doc_group_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a doc_group_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.contract_id) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a contract_id field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_user_tuid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_user_tuid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_org_toid) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a owner_org_toid field!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!req.body.owner_office_id || req.body.owner_office_id == "null") {
      req.body.owner_office_id = null;
    }
    if (!req.body.expired_at) {
      removeFile = fnRemoveAsyncFile(req.file.path);
      return res.status(400).send({
        status: 400,
        isRaw: true,
        body: {
          req: {
            message: "Please req a expired_at field!",
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
    console.log(fileContent);
    const fileClassify = await ocrData.fnOcrExtractClassify(
      req.file.originalname
    );

    // Seach user by tuid
    console.log("el request de tuid: " + req.body.owner_user_tuid);
    let userInfo = await reSIODBQuerys.fnSearchUserInfoByTuid(
      req.body.owner_user_tuid
    ); // 9998797483398 // Maza 1950918133558

    // Search org id for owner_org_toid (doc - owner_org_toid -> org - tuid)
    let orgInfo = await reSIODBQuerys.fnSearchOrgsInfoByToid(
      req.body.owner_org_toid
    );

    // Create fields to DB reSIO
    let isactive = true;
    let isvalid = true;
    let isreviewed = false;
    let arrClassifyNatural = fileClassify.split(/_/); //split(/_ ¡|! ¿|[?]/);//split(/_/);
    // get current date
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = date_time.getHours();
    // get current minutes
    let minutes = date_time.getMinutes();
    // get current seconds
    let seconds = date_time.getSeconds();
    // get current milliseconds
    let milliseconds = date_time.getMilliseconds();

    if (arrClassifyNatural[0] == "1") {
      arrClassifyNatural[1] = "25";
    } 

    // Add Document in DB reSIO
    let documentInfo = await reSIODBQuerys.fnCreateDocumentToDB(
      `Poliza ${arrClassifyNatural[2]} ${arrClassifyNatural[3]}`,
      req.body.doc_group_id,
      arrClassifyNatural[1],
      req.body.contract_id,
      `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${arrClassifyNatural[1]}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      isvalid,
      isreviewed,
      isactive,
      userInfo.body.id,
      orgInfo.body.id,
      req.body.owner_office_id,
      req.body.expired_at.toString()
    );
    console.log(documentInfo);

    // configuring parameters
    var params = {
      Bucket: process.env.AWSS3_ACCESS_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `${orgInfo.body.biz_abbr}/users/${userInfo.body.tuid}_${req.body.doc_group_id}_${typeIdDoc}_${req.body.contract_id}_${year}${month}${date}.pdf`,
      //ACL: 'public-read',
      ContentType: "application/pdf"
    };

    const options = {
      headers: {
        'Content-Type': 'application/pdf'
      }
    };

    // Aws S3 Bucket Upload File
    s3.upload(params, options, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }

      //success
      if (data) {
        removeFile = fnRemoveAsyncFile(req.file.path);
        console.log("Uploaded in:", data.Location);
      }
    });

    res.status(200).send({
      status: 200,
      isRaw: true,
      body: {
        req: {
          id: documentInfo.body.req.id,
          name: documentInfo.body.req.name,
          doc_group_id: documentInfo.body.req.doc_group_id,
          doc_type_id: documentInfo.body.req.doc_type_id,
          contract_id: documentInfo.body.req.contract_id,
          url: documentInfo.body.req.url,
          isvalid: documentInfo.body.req.isvalid,
          isreviewed: documentInfo.body.req.isreviewed,
          isactive: documentInfo.body.req.isactive,
          owner_user_id: documentInfo.body.req.owner_user_id,
          owner_org_id: documentInfo.body.req.owner_org_id,
          owner_office_id: documentInfo.body.req.owner_office_id,
          expired_at: documentInfo.body.req.expired_at,
          created_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          modified_at: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}+00`,
          ocrdoc_classify: fileClassify,
          url_bucket: `https://resio.s3.amazonaws.com/${documentInfo.body.req.url}`,
          message: "Uploaded the file successfully: " + req.file.path,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);

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
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
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
  upload,
  aerContUpload,
  tndSegUploadBucket,
  seguTiendaSekuraUploadBucket,
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
