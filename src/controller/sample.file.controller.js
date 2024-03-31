import { writeFileSync } from "fs";

// OCR Documment
import {
  fnOcrEDR
} from "./ocrfile.controller.js";

// File Utils
import {
  fnRemoveAsyncFile,
  fnCreatePathFiles,
} from "./file.utils.controller.js";

const sampleUploadFile = async (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
      }
      await fnCreatePathFiles();
      writeFileSync(__basedir + "/resources/static/assets/uploads/" + req.files.pdfFile.name, req.files.pdfFile.data);
      let fileContentDataReader = await fnOcrEDR(req.files.pdfFile.name);
      fnRemoveAsyncFile(__basedir + "/resources/static/assets/uploads/" + req.files.pdfFile.name);
      res.send(fileContentDataReader.body);
}

const sampleSaveFile = async (req, res) => {
  writeFileSync(__basedir + "/src/documents/" + req.body.sampleFileName + ".txt", req.body.pdfContentRaw);
  res.send(`The file has been saved successfully: ${__basedir}/src/documents/${req.body.sampleFileName}.txt`);
}

export {
    sampleUploadFile,
    sampleSaveFile
}