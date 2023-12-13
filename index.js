// Express routing module
const express = require("express");
const fileUpload = require("express-fileupload");

// Pdf Reading module
const pdfParse = require("pdf-parse");
const bodyParser = require("body-parser");

// Variable app
const app = express();
const path = require("path");

// Settings
app.set("port", 3000);

// Natural IA
const naturalfnController = require("./src/controller/natural.controller");

// Multer & Cors (GET/SET Read Documents)
global.__basedir = __dirname;
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3001",
};
app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

// Middleware api
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initRoutes(app);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.engine("html", require("ejs").renderFile);
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));

naturalfnController.mainNatural();

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
  console.log("App listening in port " + app.get("port"));
});