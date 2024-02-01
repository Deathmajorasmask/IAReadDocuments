import { Router } from "express";
const router = Router();
import { seguTiendaSekuraUploadFile, test } from "../controller/file.controller.js";

let routes = (app) => {
  router.post("/segutiendasekurauploadfile", seguTiendaSekuraUploadFile);
  router.post("/test", test);
  app.use(router);
};

export default routes;

/**
There are 3 routes with corresponding controller methods:
    POST /upload: upload()
    GET /files: getListFiles()
    GET /files/[fileName]: download()
 */
