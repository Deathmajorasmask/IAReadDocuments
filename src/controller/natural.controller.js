// fs module
import { readFileSync } from "fs";
import { join } from "path";
// Natural IA See Documentation: https://github.com/NaturalNode/natural
import pkg from "natural";
const { BayesClassifier, SentimentAnalyzer, PorterStemmer, PorterStemmerEs} = pkg;
const classifier = new BayesClassifier(PorterStemmerEs);
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
  const data = readFileSync(join(__dirname, "./src/documents/" + dirFile), {
    encoding: "utf8",
  });
  classifier.addDocument(data, typeFile);
  return data;
}

// Load the initial samples, here the magic happens to prepare the beginning of Bayes theorem
async function readSamplesInit() {
  logger.info(`Extract natural_classify...`);
  let classifyProducts = await fnLoadIdClassifyProductsArray();
  logger.info(`classifyProducts: ${classifyProducts}`);
  let classifyDocsType = await fnLoadIdClassifyDocsTypeArray();
  logger.info(`classifyProducts: ${classifyDocsType}`);
  logger.info(`End extract natural_classify...`);

  logger.info(`Read Samples...`);
  for (const element of classifyProducts.body) {
    switch (element.id) {
      case 1: // Autos - auto
        logger.warn(`Waiting for samples AUTOS_SAMPLES`);
        break;
      case 2: // Flotillas - flotillas
        logger.info(`Loaded AUTOS_SAMPLES`);
        readDocumentSamples(
          "sample_auto_Banorte.txt",
          `1_${element.id}_${element.name}_Banorte`
        );
        readDocumentSamples(
          "sample_auto_Banorte2.txt",
          `1_${element.id}_${element.name}_Banorte`
        );
        readDocumentSamples(
          "sample_auto_Banorte3.txt",
          `1_${element.id}_${element.name}_Banorte`
        );
        readDocumentSamples(
          "sample_auto_Chubb.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_auto_Chubb2.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_auto_Chubb3.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_auto_Gnp.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_auto_Gnp2.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_auto_Gnp3.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_auto_Primero.txt",
          `1_${element.id}_${element.name}_Primero`
        );
        readDocumentSamples(
          "sample_auto_Primero2.txt",
          `1_${element.id}_${element.name}_Primero`
        );
        readDocumentSamples(
          "sample_auto_Primero3.txt",
          `1_${element.id}_${element.name}_Primero`
        );
        readDocumentSamples(
          "sample_auto_Qualitas.txt",
          `1_${element.id}_${element.name}_Qualitas`
        );
        readDocumentSamples(
          "sample_auto_Qualitas2.txt",
          `1_${element.id}_${element.name}_Qualitas`
        );
        readDocumentSamples(
          "sample_auto_Qualitas3.txt",
          `1_${element.id}_${element.name}_Qualitas`
        );
        break;
      case 3: // Gastos Médicos Mayores - gmm
        logger.info(`Loaded GMM_Samples`);
        readDocumentSamples(
          "sample_gmm_Atlas.txt",
          `1_${element.id}_${element.name}_Atlas`
        );
        readDocumentSamples(
          "sample_gmm_Atlas2.txt",
          `1_${element.id}_${element.name}_Atlas`
        );
        readDocumentSamples(
          "sample_gmm_Atlas3.txt",
          `1_${element.id}_${element.name}_Atlas`
        );
        readDocumentSamples(
          "sample_gmm_Gnp.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_gmm_Gnp2.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_gmm_Gnp3.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_gmm_Axxa.txt",
          `1_${element.id}_${element.name}_AXA`
        );
        readDocumentSamples(
          "sample_gmm_Axxa2.txt",
          `1_${element.id}_${element.name}_AXA`
        );
        readDocumentSamples(
          "sample_gmm_Axxa3.txt",
          `1_${element.id}_${element.name}_AXA`
        );
        readDocumentSamples(
          "sample_gmm_Metlife.txt",
          `1_${element.id}_${element.name}_Metlife`
        );
        readDocumentSamples(
          "sample_gmm_Metlife2.txt",
          `1_${element.id}_${element.name}_Metlife`
        );
        readDocumentSamples(
          "sample_gmm_Metlife3.txt",
          `1_${element.id}_${element.name}_Metlife`
        );
        break;
      case 4: // Gastos Médicos Menores - accidentes
        logger.info(`Loaded GMMenores_Samples`);
        readDocumentSamples(
          "sample_gmmen_MediAccess.txt",
          `1_${element.id}_${element.name}_MediAccess`
        );
        readDocumentSamples(
          "sample_gmmen_MediAccess2.txt",
          `1_${element.id}_${element.name}_MediAccess`
        );
        readDocumentSamples(
          "sample_gmmen_MediAccess3.txt",
          `1_${element.id}_${element.name}_MediAccess`
        );
        readDocumentSamples(
          "sample_gmmen_Mms.txt",
          `1_${element.id}_${element.name}_Mms`
        );
        readDocumentSamples(
          "sample_gmmen_Mms2.txt",
          `1_${element.id}_${element.name}_Mms`
        );
        readDocumentSamples(
          "sample_gmmen_Mms3.txt",
          `1_${element.id}_${element.name}_Mms`
        );
        break;
      case 5: // Seguro Dental - dental
        logger.info(`Loaded DENTAL_SAMPLES`);
        readDocumentSamples(
          "sample_dental_Dentalia.txt",
          `1_${element.id}_${element.name}_Dentalia`
        );
        readDocumentSamples(
          "sample_dental_Dentalia2.txt",
          `1_${element.id}_${element.name}_Dentalia`
        );
        readDocumentSamples(
          "sample_dental_Dentalia3.txt",
          `1_${element.id}_${element.name}_Dentalia`
        );
        readDocumentSamples(
          "sample_dental_Dentegra.txt",
          `1_${element.id}_${element.name}_Dentegra`
        );
        readDocumentSamples(
          "sample_dental_Dentegra2.txt",
          `1_${element.id}_${element.name}_Dentegra`
        );
        readDocumentSamples(
          "sample_dental_Dentegra3.txt",
          `1_${element.id}_${element.name}_Dentegra`
        );
        break;
      case 6: // Vida - vida
        logger.info(`Loaded VIDA_SAMPLES`);
        readDocumentSamples(
          "sample_vida_Gnp.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_vida_Gnp2.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        readDocumentSamples(
          "sample_vida_Gnp3.txt",
          `1_${element.id}_${element.name}_GNP`
        );
        break;
      case 7: // Gastos Funerarios - funeral
        logger.info(`Loaded FUNERARIO_SAMPLES`);
        readDocumentSamples(
          "sample_funerario_Thona.txt",
          `1_${element.id}_${element.name}_Thona`
        );
        readDocumentSamples(
          "sample_funerario_Thona2.txt",
          `1_${element.id}_${element.name}_Thona`
        );
        readDocumentSamples(
          "sample_funerario_Thona3.txt",
          `1_${element.id}_${element.name}_Thona`
        );
        break;
      case 8: // Accidentes Personales - ap
        logger.warn(`Waiting for samples ACCIDENTES PERSONALES_SAMPLES`);
        break;
      case 9: // Vida Deudor - NULL
        logger.warn(`Waiting for samples VIDA DEUDOR_SAMPLES`);
        break;
      case 10: // Daños Casa  - casa
        logger.info(`Loaded HOGAR_SAMPLES`);
        readDocumentSamples(
          "sample_hogar_Chubb.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_hogar_Chubb2.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_hogar_Chubb3.txt",
          `1_${element.id}_${element.name}_Chubb`
        );
        readDocumentSamples(
          "sample_hogar_Zurich.txt",
          `1_${element.id}_${element.name}_Zurich`
        );
        readDocumentSamples(
          "sample_hogar_Zurich2.txt",
          `1_${element.id}_${element.name}_Zurich`
        );
        readDocumentSamples(
          "sample_hogar_Zurich3.txt",
          `1_${element.id}_${element.name}_Zurich`
        );
        break;
      case 11: // Excesos GMM - excesos
        logger.warn(`Waiting for samples EXCESOS GMM_SAMPLES`);
        break;
      case 12: // Ambulancia - ambulancia
        logger.warn(`Waiting for samples AMBULANCIA_SAMPLES`);
        break;
      case 13: // Daños Activos - daños
        logger.warn(`Waiting for samples DAÑOS ACTIVOS_SAMPLES`);
        break;
      default:
    }
  }

  for (const element of classifyDocsType.body) {
    for (let j = 0; j < 3; j++) {
      logger.info(`sample_${element.id}_${element.name}_${j}.txt`);
      readDocumentSamples(
        `sample_${element.id}_${element.name}_${j}.txt`,
        `2_${element.id}_${element.name}_DocsPersonal`
      );
    }
  }

  readDocumentSamples("sample_cDom_Agua.txt", "2_33_cDom_Agua");
  readDocumentSamples("sample_cDom_CFE.txt", "2_33_cDom_CFE");
  readDocumentSamples("sample_cDom_CFE2.txt", "2_33_cDom_CFE");
  readDocumentSamples("sample_cDom_CFE3.txt", "2_33_cDom_CFE");
  readDocumentSamples("sample_cDom_Gas.txt", "2_33_cDom_Gas");
  readDocumentSamples("sample_cDom_Gas2.txt", "2_33_cDom_Gas");
  readDocumentSamples("sample_cPers_Conductor_Err.txt", "2_33_Error_Conductor");
  logger.info(`Read Sample files content ✅`);
}

// Train the AI ​​and start Bayes theorem by saving the classifications in a json file
async function fnTrainingDataIA() {
  logger.info(`Training IA...`);
  classifier.train();
  logger.info(`Saving Classifications...`);
  classifier.save("clasificaciones.json");
}

// Load data from a file asynchronously with encoding utf-8
async function classifyDocumentSamples(dirFile) {
  const data = readFileSync(join(__dirname, "./src/documents/" + dirFile), {
    encoding: "utf8",
  });
  return data;
}

// Run a classification test using Bayes theorem, uploading test files
async function fnTestClassification() {
  logger.info(`Classification test is carried out...`);
  classifyDocumentSamples("test_gmm_Gnp.txt");
  classifyDocumentSamples("test_gmm_Axxa.txt");
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
      classifyDocumentSamples("test_gmm_Axxa2.txt");
      classifyDocumentSamples("test_gmm_Axxa3.txt");
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

// Load the products into an array from the json file
async function fnLoadIdClassifyProductsArray() {
  let file = readFileSync(
    join(__dirname, "./src/natural_classify/natural.classify.products.json"),
    "utf8"
  );
  let json = JSON.parse(file);
  return json;
}

// Load the docs type into an array from the json file
async function fnLoadIdClassifyDocsTypeArray() {
  let file = readFileSync(
    join(__dirname, "./src/natural_classify/natural.classify.docs.json"),
    "utf8"
  );
  let json = JSON.parse(file);
  return json;
}

// sentiment analysis module based on an array of words in English
async function sentimentSentenceAfinnEng(data){
  return analyzerEng.getSentiment(data);
}

// sentiment analysis module based on an array of words
async function sentimentSentenceAfinn(data){
  return analyzer.getSentiment(data)
}

async function mainNatural() {
  await readSamplesInit();
  await fnTrainingDataIA();
  await fnTestClassification();
  // await sentimentSentenceAfinn(["Me", "gusta", "programar"]);
  // await sentimentSentenceAfinnEng(["I", "hate", "books"]);
}

export {
  fnGetClassifyData,
  mainNatural,
};
