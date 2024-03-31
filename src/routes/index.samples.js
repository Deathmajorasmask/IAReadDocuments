import { sampleUploadFile, sampleSaveFile } from "../controller/sample.file.controller.js";

const samplesInitRouter = (app) => {
    app.post("/extract-text", sampleUploadFile);
    app.post ("/save-sample", sampleSaveFile);
}

export default samplesInitRouter;