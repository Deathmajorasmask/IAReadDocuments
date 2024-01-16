const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.post("/aercontupload", controller.aerContUpload);
  router.post("/tndseguploadbucket", controller.tndSegUploadBucket);
  app.use(router);
};

module.exports = routes;

/**
There are 3 routes with corresponding controller methods:
    POST /upload: upload()
    GET /files: getListFiles()
    GET /files/[fileName]: download()
 */
