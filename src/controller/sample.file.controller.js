import { writeFileSync } from "fs";

// OCR Documment
import {
  fnOcrExtractDataReader
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
      let fileContentDataReader = await fnOcrExtractDataReader(req.files.pdfFile.name);
      let removeFile = fnRemoveAsyncFile(__basedir + "/resources/static/assets/uploads/" + req.files.pdfFile.name);
      res.send(fileContentDataReader.body);
}

export {
    sampleUploadFile,
}