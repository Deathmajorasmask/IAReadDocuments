// fs module
import { readFileSync } from "fs";

// File Utils
import {
  fnFileIsEmpty,
  fnLoadJSONFile,
  fnReturnCustomSamplesFolderPath,
  fnReturnSamplesFolderPath,
} from "./file.utils.controller.js";

// Natural IA See Documentation: https://github.com/NaturalNode/natural
import pkg from "natural";
const { BayesClassifier, SentimentAnalyzer, PorterStemmer, PorterStemmerEs } =
  pkg;
const classifier = new BayesClassifier(PorterStemmerEs); // Classifier Spanish Languague
// Sentiment Analysis
// languageFiles in SentimentAnalyzer.js
const Analyzer = SentimentAnalyzer;
const stemmer = PorterStemmer;
const analyzer = new Analyzer("Spanish", stemmer, "afinn");
const analyzerEng = new Analyzer("English", stemmer, "afinn");

// winston logs file config
import logger from "../logs_module/logs.controller.js";

// Send plain text documents to be classified by relating them to a file type
async function readDocumentSamples(dirFile, typeFile) {
  let data = readFileSync(dirFile, {
    encoding: "utf8",
  });
  classifier.addDocument(data, typeFile);
  return data;
}

// Get plain text documents
async function extractPlainTextSamples(dirFile) {
  let data = readFileSync(dirFile, {
    encoding: "utf8",
  });
  return data;
}

// Send plain text to be classified by relating them to a file type
async function readDataSamples(data, typeFile) {
  classifier.addDocument(data, typeFile);
  return data;
}

// Load the initial samples, here the magic happens to prepare the beginning of Bayes theorem
async function readSamplesInit() {
  logger.info(`Extract natural_classify...`);
  let classifyCustomSamples = await fnLoadJSONFile(
    await fnReturnCustomSamplesFolderPath("customSamples.json")
  );
  logger.info(`End extract natural_classify...`);
  logger.info(`Read Samples...`);

  // custom samples.json is empty or is not a valid array
  if (
    Array.isArray(classifyCustomSamples) &&
    classifyCustomSamples.length > 0
  ) {
    for (const item of classifyCustomSamples) {
      // Get the route of the samples
      const filePath = await fnReturnSamplesFolderPath(item.file);

      // Builds the file handle
      const fileIdentifier = `${item.idClassifyTypeFile}_${item.idElementClassify}_${item.nameClassifyTypeFile}_${item.shortnameTypeFile}`;
      logger.info(fileIdentifier);

      // Verifica si el archivo está vacío
      const isEmpty = await fnFileIsEmpty(filePath);
      if (isEmpty) {
        logger.error(`The file ${filePath} It's empty. Skip...`);
        continue; // Go to the next item if the file is empty
      }

      // Send the route of the sample and add it to the classification
      await readDocumentSamples(
        await fnReturnSamplesFolderPath(item.file),
        `${item.idClassifyTypeFile}_${item.idElementClassify}_${item.nameClassifyTypeFile}_${item.shortnameTypeFile}`
      );
    }
  } else {
    logger.error("The custom samples.json is empty or is not a valid array.");
  }

  logger.info(`Read Sample files content ✅`);
}

// Train the AI ​​and start Bayes theorem by saving the classifications in a json file
async function fnTrainingDataIA() {
  logger.info(`Training IA...`);
  classifier.train();
  logger.info(`Saving Classifications...`);
  classifier.save("clasificaciones.json");
}

// Load data from a file asynchronously with encoding utf-8 ****************
async function classifyDocumentSamples(dirFile) {
  const data = readFileSync(dirFile, {
    encoding: "utf8",
  });
  return data;
}

// Run a classification test using Bayes theorem, uploading test files
async function fnTestClassification() {
  logger.info(`Classification test is carried out...`);
  classifyDocumentSamples(await fnReturnSamplesFolderPath("test_gmm_Gnp.txt"));
  classifyDocumentSamples(await fnReturnSamplesFolderPath("test_gmm_Axxa.txt"));
  fnGetClassifyDataArrayNormalized(
    await classifyDocumentSamples(
      await fnReturnSamplesFolderPath("test_gmm_Axxa.txt")
    )
  );
  logger.info(`Classifier working correctly`);
}

// NOT USED
// Run a classification test using Bayes theorem, Tests using the knowledge gained from classifications.json
async function fnLoadingClassification() {
  logger.info(`Loading Classifications...`);
  BayesClassifier.load(
    "clasificaciones.json",
    null,
    function (err, classifier) {
      classifyDocumentSamples(fnReturnSamplesFolderPath("test_gmm_Axxa2.txt"));
      classifyDocumentSamples(fnReturnSamplesFolderPath("test_gmm_Axxa3.txt"));
    }
  );
}

// NOT USED
// Get the classifications using Bayes theorem from a json file
async function fnLoadGetClassifyDataFromJson(jsonName, data) {
  BayesClassifier.load(jsonName, null, function (err, classifier) {
    return classifier.classify(data);
  });
}

// Obtains the classification according to Bayes theorem from a text string.
async function fnGetClassifyData(data) {
  let res = classifier.classify(data);
  return res;
}

// Obtains the details classification Naive Bayes - Clasificador Bayesiano ingenuo
async function fnGetClassifyDataArrayNormalized(data) {
  let classificationsData = classifier.getClassifications(data);
  // Calculate the total sum of the values
  let totalSum = classificationsData.reduce((sum, item) => sum + item.value, 0);
  // Normalize the values
  let normalizedData = classificationsData.map((item) => ({
    label: item.label,
    value: item.value / totalSum,
  }));
  // Return array normalized
  return normalizedData;
}

// sentiment analysis module based on an array of words in English
async function sentimentSentenceAfinnEng(data) {
  return analyzerEng.getSentiment(data);
}

// sentiment analysis module based on an array of words
async function sentimentSentenceAfinn(data) {
  return analyzer.getSentiment(data);
}

async function mainNatural() {
  await readSamplesInit();
  await fnTrainingDataIA();
  await fnTestClassification();
  /*   console.log(await sentimentSentenceAfinn(["Me", "gusta", "programar"]));
  console.log(await sentimentSentenceAfinnEng(["I", "hate", "books"])); */
}

export {
  mainNatural,
  fnGetClassifyData,
  fnGetClassifyDataArrayNormalized,
  readDataSamples,
  fnTrainingDataIA,
};
