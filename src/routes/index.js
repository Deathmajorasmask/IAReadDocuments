const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/segutiendasekurauploadfile", controller.seguTiendaSekuraUploadFile);
  router.post("/test", controller.test);
  app.use(router);
};

module.exports = routes;

/**
There are 3 routes with corresponding controller methods:
    POST /upload: upload()
    GET /files: getListFiles()
    GET /files/[fileName]: download()
 */
