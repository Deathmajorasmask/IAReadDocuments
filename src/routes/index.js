import { Router } from "express";
const router = Router();
import {
  otherTest,
  sendFileToAnalysis,
  test,
  uploadFolderToSample,
} from "../controller/file.controller.js";

const routes = (app) => {
  router.post("/test", test);
  router.post("/otherTest", otherTest);
  router.post("/uploadFolderToSample", uploadFolderToSample);
  router.post("/sendFileToAnalysis", sendFileToAnalysis);
  app.use(router);
};

export default routes;

/**
There are 3 routes with corresponding controller methods:
    POST /upload: upload()
    GET /files: getListFiles()
    GET /files/[fileName]: download()
 */
