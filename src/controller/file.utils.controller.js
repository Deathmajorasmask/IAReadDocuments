// File reader
import { unlinkSync, existsSync, mkdirSync } from "fs";
import path from "path"

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
  if (!existsSync(__basedir + "/resources/static/assets/uploads")) {
    mkdirSync("./resources/static/assets/uploads", { recursive: true });
  }
}

async function fnReadExtensionFile(dirPathDoc){
  return path.extname(dirPathDoc);
}

export { fnRemoveAsyncFile, fnCreatePathFiles, fnReadExtensionFile };
