/* import tesseract from "tesseract.js";

async function TesseractReadFile(dirPathDoc) {
  return new Promise((resolve, reject) => {
    tesseract
      .recognize(__basedir + "/test/data/imageTest.png", "eng", {
        logger: (e) => console.log(e),
      })
      .then((out) => resolve(out.data.text));
  });
}
export { TesseractReadFile }; */

import { createWorker } from "tesseract.js";
const worker = await createWorker("eng", 1, {
  logger: (m) => console.log(m), // Add logger here
});

async function TesseractReadFileWorker(dirPathDoc) {
  const {
    data: { text },
  } = await worker.recognize(__basedir + "/test/data/imageTest.png");
  console.log(text);
  await worker.terminate();
  return text;
}

export { TesseractReadFileWorker };
