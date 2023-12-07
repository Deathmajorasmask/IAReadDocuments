// Natural IA See Documentation: https://github.com/NaturalNode/natural
// fs module
const fs = require("fs");
const path = require('path');
const natural = require('natural');
const classifier = new natural.BayesClassifier();


async function readDocumentSamples(dirFile, typeFile){
    const data = fs.readFileSync(path.join(__dirname,'./../documents/' + dirFile), {encoding: 'utf8'});
    classifier.addDocument(data, typeFile);
    return data;
}

async function readSamples(){
    console.log('Creando registros...');
    // AUTOS SAMPLES
    readDocumentSamples('sample_auto_Banorte.txt', "Automóviles-Flotilla-Banorte");
    readDocumentSamples("sample_auto_Banorte2.txt", "Automóviles-Flotilla-Banorte");
    readDocumentSamples("sample_auto_Banorte3.txt", "Automóviles-Flotilla-Banorte");
    readDocumentSamples("sample_auto_Chubb.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("sample_auto_Chubb2.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("sample_auto_Chubb3.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("sample_auto_Gnp.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("sample_auto_Gnp2.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("sample_auto_Gnp3.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("sample_auto_Primero.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("sample_auto_Primero2.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("sample_auto_Primero3.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("sample_auto_Qualitas.txt", "Automóviles-Flotilla-Qualitas");
    readDocumentSamples("sample_auto_Qualitas2.txt", "Automóviles-Flotilla-Qualitas");
    readDocumentSamples("sample_auto_Qualitas3.txt", "Automóviles-Flotilla-Qualitas");
    // DENTAL SAMPLES
    readDocumentSamples("sample_dental_Dentalia.txt", "Dental-Dentalia");
    readDocumentSamples("sample_dental_Dentalia2.txt", "Dental-Dentalia");
    readDocumentSamples("sample_dental_Dentalia3.txt", "Dental-Dentalia");
    readDocumentSamples("sample_dental_Dentegra.txt", "Dental-Dentegra");
    readDocumentSamples("sample_dental_Dentegra2.txt", "Dental-Dentegra");
    readDocumentSamples("sample_dental_Dentegra3.txt", "Dental-Dentegra");
    // GMM Samples
    readDocumentSamples("sample_gmm_Atlas.txt", "GMM-Atlas");
    readDocumentSamples("sample_gmm_Atlas2.txt", "GMM-Atlas");
    readDocumentSamples("sample_gmm_Atlas3.txt", "GMM-Atlas");
    readDocumentSamples("sample_gmm_Gnp.txt", "GMM-Gnp");
    readDocumentSamples("sample_gmm_Gnp2.txt", "GMM-Gnp");
    readDocumentSamples("sample_gmm_Gnp3.txt", "GMM-Gnp");
    readDocumentSamples("sample_gmm_Axxa.txt", "GMM-Axxa");
    readDocumentSamples("sample_gmm_Axxa2.txt", "GMM-Axxa");
    readDocumentSamples("sample_gmm_Axxa3.txt", "GMM-Axxa");
    readDocumentSamples("sample_gmm_Metlife.txt", "GMM-Metlife");
    readDocumentSamples("sample_gmm_Metlife2.txt", "GMM-Metlife");
    readDocumentSamples("sample_gmm_Metlife3.txt", "GMM-Metlife");
    // GMMenores Samples
    readDocumentSamples("sample_gmmen_MediAccess.txt", "GMMenores-MediAccess");
    readDocumentSamples("sample_gmmen_MediAccess2.txt", "GMMenores-MediAccess");
    readDocumentSamples("sample_gmmen_MediAccess3.txt", "GMMenores-MediAccess");
    readDocumentSamples("sample_gmmen_Mms.txt", "GMMenores-Mms");
    readDocumentSamples("sample_gmmen_Mms2.txt", "GMMenores-Mms");
    readDocumentSamples("sample_gmmen_Mms3.txt", "GMMenores-Mms");
    // Hogar Samples
    readDocumentSamples("sample_hogar_Chubb.txt", "Hogar-Chubb");
    readDocumentSamples("sample_hogar_Chubb2.txt", "Hogar-Chubb");
    readDocumentSamples("sample_hogar_Chubb3.txt", "Hogar-Chubb");
    readDocumentSamples("sample_hogar_Zurich.txt", "Hogar-Zurich");
    readDocumentSamples("sample_hogar_Zurich2.txt", "Hogar-Zurich");
    readDocumentSamples("sample_hogar_Zurich3.txt", "Hogar-Zurich");
    // Vida Samples
    readDocumentSamples("sample_vida_Gnp.txt", "Vida-Gnp");
    readDocumentSamples("sample_vida_Gnp2.txt", "Vida-Gnp");
    readDocumentSamples("sample_vida_Gnp3.txt", "Vida-Gnp");
    // Funerario Samples
    readDocumentSamples("sample_funerario_Thona.txt", "Funerario-Thona");
    readDocumentSamples("sample_funerario_Thona2.txt", "Funerario-Thona");
    readDocumentSamples("sample_funerario_Thona3.txt", "Funerario-Thona");
    // Other Samples
    readDocumentSamples("sample_cActa_Matrimonio.txt", "cActa-Matrimonio");
    readDocumentSamples("sample_cCURP_Basic.txt", "cCURP-CURP");
    readDocumentSamples("sample_cDom_Agua.txt", "cDom-Agua");
    readDocumentSamples("sample_cDom_CFE.txt", "cDom-CFE");
    readDocumentSamples("sample_cDom_CFE2.txt", "cDom-CFE");
    readDocumentSamples("sample_cDom_CFE3.txt", "cDom-CFE");
    readDocumentSamples("sample_cDom_Gas.txt", "cDom-Gas");
    readDocumentSamples("sample_cDom_Gas2.txt", "cDom-Gas");
    readDocumentSamples("sample_cPers_Conductor_Err.txt", "Error-Conductor");
    console.log("Read Sample files content ✅");
}

async function fnTrainingDataIA(){
    console.log('Training IA...');
    classifier.train();
    console.log('Saving Classifications...');
    classifier.save('clasificaciones.json');
}

async function classifyDocumentSamples(dirFile){
    const data = fs.readFileSync(path.join(__dirname,'./../documents/' + dirFile), {encoding: 'utf8'});
    console.log( classifier.classify(data) );
    return data;
}

async function fnTestClassification(){
    console.log('Realizando prueba de clasificación...');
    classifyDocumentSamples("test_gmm_Gnp.txt");
    classifyDocumentSamples("test_gmm_Axxa.txt");
}

async function fnGetClassificationsDocumment(dirFile){
    const data = fs.readFileSync(path.join(__dirname,'./../documents/' + dirFile), {encoding: 'utf8'});
    console.log(classifier.getClassifications(data));
    return data;
}

async function fnLoadingClassification(){
    console.log('Loading Classifications...');
    natural.BayesClassifier.load('clasificaciones.json', null, function(err, classifier) {
        classifyDocumentSamples("test_gmm_Axxa2.txt");
        fnGetClassificationsDocumment("test_gmm_Axxa3.txt");
    });
}

async function fnLoadClassifyFileFromJson(jsonName, dirFile){
    natural.BayesClassifier.load(jsonName, null, function(err, classifier) {
        classifyDocumentSamples(dirFile);
    });
}

async function fnLoadGetClassifyFileFromJson(jsonName, dirFile){
    natural.BayesClassifier.load(jsonName, null, function(err, classifier) {
        fnGetClassificationsDocumment(dirFile);
    });
}

async function fnLoadGetClassifyDataFromJson(jsonName, data){
    natural.BayesClassifier.load(jsonName, null, function(err, classifier) {
        console.log(classifier.classify(data));
        return classifier.classify(data)
      });
}

async function fnGetClassifyData(data){
    console.log(classifier.classify(data))
    return classifier.classify(data)
}

/* async function mainReadClassifyDoc(jsonName, data){
    await fnLoadGetClassifyDataFromJson(jsonName, data);
} */

async function mainNatural(){
    await readSamples();
    await fnTrainingDataIA();
    await fnTestClassification();
    await fnLoadingClassification();
}

module.exports = {
    readDocumentSamples,
    readSamples,
    fnTrainingDataIA,
    classifyDocumentSamples,
    fnTestClassification,
    fnGetClassificationsDocumment,
    fnLoadingClassification,
    fnLoadClassifyFileFromJson,
    fnLoadGetClassifyFileFromJson,
    fnLoadGetClassifyDataFromJson,
    fnGetClassifyData,
    mainNatural,
}