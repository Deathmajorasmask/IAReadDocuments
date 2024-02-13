import { promisify } from "util";
import multer, { diskStorage } from "multer";
const maxSize = 22282810 //= 2 * 1024 * 1024;

let storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = promisify(uploadFile);
export default uploadFileMiddleware;

/*
First, we import multer module.
– Next, we configure multer to use Disk Storage engine.

You can see that we have two options here:
– destination determines folder to store the uploaded files.
– filename determines the name of the file inside the destination folder.

util.promisify() makes the exported middleware object can be used with async-await
*/