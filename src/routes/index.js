import { Router } from "express";
const router = Router();
import { test } from "../controller/file.controller.js";


const routes = (app) => {
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
