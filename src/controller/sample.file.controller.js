import { writeFileSync } from "fs";

// OCR Documment
import { fnOcrEDR } from "./ocrfile.controller.js";

// File Utils
import {
  fnRemoveAsyncFile,
  fnReturnUploadFolderPath,
  fnReturnSamplesFolderPath,
} from "./file.utils.controller.js";

const sampleUploadFile = async (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }
  writeFileSync(
    await fnReturnUploadFolderPath(req.files.pdfFile.name),
    req.files.pdfFile.data
  );
  let fileContentDataReader = await fnOcrEDR(
    await fnReturnUploadFolderPath(req.files.pdfFile.name)
  );
  fnRemoveAsyncFile(await fnReturnUploadFolderPath(req.files.pdfFile.name));
  res.send(fileContentDataReader);
};

const sampleSaveFile = async (req, res) => {
  writeFileSync(
    await fnReturnSamplesFolderPath(req.body.sampleFileName + ".txt"),
    req.body.pdfContentRaw
  );
  res.send(
    `The file has been saved successfully: ${await fnReturnSamplesFolderPath(
      req.body.sampleFileName + ".txt"
    )}`
  );
};

export { sampleUploadFile, sampleSaveFile };
