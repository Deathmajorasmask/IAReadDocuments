const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");
const usersController = require("../controller/indexDB.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.delete("/files/:name", controller.remove);

  router.get("/users", usersController.getUsers);
  router.get("/users/:id", usersController.getUserById);
  router.put("/users/:id", usersController.updateUser);
  router.post("/users", usersController.createUser);
  router.delete("/users/:id", usersController.deleteUser);
  app.use(router);
};

module.exports = routes;

/**
There are 3 routes with corresponding controller methods:
    POST /upload: upload()
    GET /files: getListFiles()
    GET /files/[fileName]: download()
 */