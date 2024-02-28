// winston logs file config
import logger from "../logs_module/logs.controller.js";

// File stream module
import fs from "fs";

// Tesseract Supp https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
import { createWorker } from "tesseract.js";
const worker = await createWorker("eng", 1, {
  logger: (m) => logger.info(JSON.stringify(m)), // Add logger here
});

async function TesseractRFWorker(dirPathDoc) {
  const {
    data: { text },
  } = await worker.recognize(
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc
  );
  logger.info(text);
  await worker.terminate();
  return text;
}

async function TesseractRFPDF(dirPathDoc, pdfFileName) {
  const {
    data: { text, pdf },
  } = await worker.recognize(
    //__basedir + "/test/data/imageTest.png",
    __basedir + "/resources/static/assets/uploads/" + dirPathDoc,
    { pdfTitle: pdfFileName },
    { pdf: true }
  );
  logger.info(text);
  fs.writeFileSync(
    __basedir + "/resources/static/assets/uploads/" + pdfFileName + ".pdf",
    Buffer.from(pdf)
  );
  logger.info(`Generate PDF: ${pdfFileName}`);
  await worker.terminate();
  return text;
}

export { TesseractRFWorker, TesseractRFPDF };
