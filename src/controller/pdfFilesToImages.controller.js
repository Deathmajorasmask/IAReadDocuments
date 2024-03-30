
// fs module
import { writeFileSync } from "fs";

// Converts PDFs to images in nodejs with no native dependencies.
import { pdf } from "pdf-to-img";
global.navigator = {
  userAgent: "node",
};

async function fnPdfToImage(dirPathDoc) {
  let counter = 1;
  let listNameImages = [];
  const document = await pdf(__basedir + "/resources/static/assets/uploads/" + dirPathDoc, { scale: 1 });
  for await (const image of document) {
    writeFileSync(__basedir + "/resources/static/assets/uploads/" + `${dirPathDoc}_${counter}.png`, image);
    listNameImages.push(__basedir + "/resources/static/assets/uploads/" + `${dirPathDoc}_${counter}.png`);
    counter++;
  }
  return listNameImages;
}

export { fnPdfToImage };
