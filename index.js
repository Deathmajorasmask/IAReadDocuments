// Express routing module
import express, { json, urlencoded } from "express";
import fileUpload from "express-fileupload";

// .env file
import "dotenv/config.js";

// Pdf Reading module
import pkg from 'body-parser';
const { urlencoded: _urlencoded } = pkg;

// Variable app
const app = express();
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);

// Settings
app.set("port", 3000);

// Natural IA
import { mainNatural } from "./src/controller/natural.controller.js";

// winston logs file config
import logger from "./src/logs_module/logs.controller.js";

// Multer & Cors (GET/SET Read Documents)
global.__basedir = __dirname;
import cors from "cors";
const corsOptions = {
  origin: "http://localhost:3001",
};
app.use(cors(corsOptions));

import initRoutes from "./src/routes/index.js";

// Middleware api
app.use(json());
app.use(urlencoded({ extended: true }));
initRoutes(app);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
//app.engine("html", require("ejs").renderFile);
app.use(fileUpload());
app.use(_urlencoded({ extended: false }));

mainNatural();

app.post("/extract-text", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then((result) => {
    res.send(result.text);
  });
});

app.listen(app.get("port"), () => {
  logger.info(`App listening in port: ${app.get("port")}`);
});
