import { promisify } from "util";
import multer, { diskStorage } from "multer";
import { fnReturnUploadFolderPath } from "../controller/file.utils.controller.js";
const maxSize = 22282810; //= 2 * 1024 * 1024;

let storage = diskStorage({
  destination: async (req, file, cb) => {
    //cb(null, __basedir + "/resources/uploads/");
    cb(null, await fnReturnUploadFolderPath("/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFiles = multer({
  storage,
  limits: { fileSize: maxSize }, // 1MB
  /* fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }, */
}).array("file", 10);

let uploadFileMiddleware = promisify(uploadFiles);
export default uploadFileMiddleware;
