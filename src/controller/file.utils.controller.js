// File reader
import {
  unlinkSync,
  existsSync,
  mkdirSync,
  lstatSync,
  readdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
  statSync,
} from "fs";
import path from "path";
import logger from "../logs_module/logs.controller.js";

async function fnReturnUploadFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "resources", "uploads");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating upload directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnReturnExcelFilesFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "resources", "excel");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating Excel directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnReturnSamplesFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "src", "documents");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating samples directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnReturnCustomSamplesFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "src", "documents", "customSamples");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating custom samples directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnReturnDowloadS3BucketFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "src", "documents", "S3BucketSamples");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating S3 Bucket samples directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnReturnNaturalClassFolderPath(fileName) {
  let uploadPath = path.join(__dirname, "src", "natural_classify");
  try {
    // Try to create the directory if it does not exist
    mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    logger.error(`Error creating natural classifications directory: ${err}`);
  }

  return path.join(uploadPath, fileName);
}

async function fnFileIsEmpty(rutaArchivo) {
  // Check if the file exists
  if (!existsSync(rutaArchivo)) {
    logger.warn(`The file dont exists: ${rutaArchivo}`);
    return false; // Return false if the file does not exist
  }

  // Check if the file is empty
  const stats = statSync(rutaArchivo);
  if (stats.size === 0) {
    logger.warn(`The file is null or empty: ${rutaArchivo}`);
    return true; // Return true if the file is empty
  }

  return false; // Return false if the file exists and has content
}

async function fnSaveCustomSamplesInJSON(
  pathFileJSON,
  idClassifyTypeFile,
  idElementClassify,
  nameClassifyTypeFile,
  shortnameTypeFile,
  file,
  date_time
) {
  try {
    // Check if the file exists
    let data = [];
    if (existsSync(pathFileJSON)) {
      let fileContent = readFileSync(pathFileJSON, "utf8");
      data = JSON.parse(fileContent);
    }

    // Add the new item
    let newElement = {
      idClassifyTypeFile,
      idElementClassify,
      nameClassifyTypeFile,
      shortnameTypeFile,
      file,
      date_time,
    };
    data.push(newElement);

    // Write the updated content to the file
    writeFileSync(pathFileJSON, JSON.stringify(data, null, 2), "utf8");

    logger.info(`Element added to JSON file in: ${pathFileJSON}`);
  } catch (error) {
    logger.error(`Error saving to JSON file: ${error}`);
  }
}

async function fnLoadJSONFile(pathJSON) {
  try {
    // Check if the file exists
    if (!existsSync(pathJSON)) {
      // Create an empty file initialized with an empty array
      writeFileSync(pathJSON, JSON.stringify([], null, 2), "utf8");
      logger.info(`Archivo creado: ${pathJSON}`);
    }

    // Read and parse the JSON file
    const file = readFileSync(pathJSON, "utf8");
    const json = JSON.parse(file);
    return json;
  } catch (error) {
    logger.error(`Error loading JSON file: ${error}`);
    throw error;
  }
}

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

async function fnRemoveAsyncFilesOfFolder(dirPathFolder) {
  if (!existsSync(dirPathFolder)) {
    logger.warn(`The path '${dirPathFolder}' dont exist.`);
    return;
  }

  if (!lstatSync(dirPathFolder).isDirectory()) {
    logger.warn(`'${dirPathFolder}' Its not a folder.`);
    return;
  }

  readdirSync(dirPathFolder).forEach((archivo) => {
    const rutaCompleta = path.join(dirPathFolder, archivo);

    try {
      if (lstatSync(rutaCompleta).isDirectory()) {
        rmSync(rutaCompleta, { recursive: true, force: true }); // Delete folders and their contents
      } else {
        unlinkSync(rutaCompleta); // Delete files
      }
    } catch (error) {
      logger.error(`Could not delete '${rutaCompleta}': ${error}`);
    }
  });

  logger.info(`The content of was removed '${dirPathFolder}' correctly.`);
}

async function fnRemoveAsyncFolder(dirPathFolder) {
  if (!existsSync(dirPathFolder)) {
    logger.warn(`The path '${dirPathFolder}' dont exist.`);
    return;
  }

  try {
    // Delete the container folder along with all its contents.
    rmSync(dirPathFolder, { recursive: true, force: true });
    logger.info(
      `The folder '${dirPathFolder}' and its contents have been successfully removed.`
    );
  } catch (error) {
    logger.error(`Failed to delete folder '${dirPathFolder}': ${error}`);
  }

  logger.info(`The content of was removed '${dirPathFolder}' correctly.`);
}

async function fnReadExtensionFile(dirPathDoc) {
  return path.extname(dirPathDoc);
}

async function fnRemoveExtensionFile(fileName) {
  // Use `lastIndexOf` to find the last period in the file name
  const indexLastPoint = fileName.lastIndexOf(".");

  // If there is no point or it is at the beginning, returns the original string
  if (indexLastPoint === -1 || indexLastPoint === 0) {
    return fileName;
  }

  // Returns the part of the name before the last period
  return fileName.substring(0, indexLastPoint);
}

export {
  fnFileIsEmpty,
  fnRemoveAsyncFile,
  fnRemoveAsyncFolder,
  fnRemoveAsyncFilesOfFolder,
  fnReadExtensionFile,
  fnRemoveExtensionFile,
  fnReturnUploadFolderPath,
  fnReturnSamplesFolderPath,
  fnReturnNaturalClassFolderPath,
  fnReturnCustomSamplesFolderPath,
  fnReturnDowloadS3BucketFolderPath,
  fnReturnExcelFilesFolderPath,
  fnSaveCustomSamplesInJSON,
  fnLoadJSONFile,
};
