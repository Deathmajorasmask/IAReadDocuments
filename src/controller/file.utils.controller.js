// File reader
import { unlinkSync, existsSync, mkdirSync } from "fs";

async function fnRemoveAsyncFile(dirPathDoc) {
  try {
    unlinkSync(dirPathDoc);
    return true;
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
}

async function fnCreatePathFiles() {
  if (existsSync(__basedir + "/resources/static/assets/uploads")) {
    console.log("Create Path");
  } else {
    mkdirSync("./resources/static/assets/uploads", { recursive: true });
  }
}

export { fnRemoveAsyncFile, fnCreatePathFiles };
