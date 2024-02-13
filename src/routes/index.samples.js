import { sampleUploadFile } from "../controller/sample.file.controller.js";

const samplesInitRouter = (app) => {
    app.post("/extract-text", sampleUploadFile);
}

export default samplesInitRouter;