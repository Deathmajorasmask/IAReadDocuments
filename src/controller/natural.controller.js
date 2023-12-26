// Natural IA See Documentation: https://github.com/NaturalNode/natural
// fs module
const fs = require("fs");
const path = require('path');
const natural = require('natural');
const classifier = new natural.BayesClassifier();

// reSIO database controller
const reSIODBQuerysNatural = require("./reSIO.query.controller");

async function readDocumentSamples(dirFile, typeFile){
    const data = fs.readFileSync(path.join(__dirname,'./../documents/' + dirFile), {encoding: 'utf8'});
    classifier.addDocument(data, typeFile);
    return data;
}

async function readSamplesInit(){
    console.log('Connect DB reSIO...');
    let classifyProducts = await reSIODBQuerysNatural.fnLoadIdClassifyProductsArray();
    let classifyDocsType = await reSIODBQuerysNatural.fnLoadIdClassifyDocsTypeArray();
    console.log('End Connection DB reSIO...');

    console.log('Read Samples...');
    for(i=0; i < classifyProducts.body.length; i++){
        console.log(classifyProducts.body[i]);
        switch(classifyProducts.body[i].id){
            case '1': // Autos - auto

                break;
            case '2': // Flotillas - flotillas
                    console.log("AUTOS_SAMPLES");
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
                break;
                case '3': // Gastos Médicos Mayores - gmm
                    console.log("GMM_Samples");
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
                break;
                case '4': // Gastos Médicos Menores - accidentes
                    console.log("GMMenores_Samples");
                    readDocumentSamples("sample_gmmen_MediAccess.txt", "GMMenores-MediAccess");
                    readDocumentSamples("sample_gmmen_MediAccess2.txt", "GMMenores-MediAccess");
                    readDocumentSamples("sample_gmmen_MediAccess3.txt", "GMMenores-MediAccess");
                    readDocumentSamples("sample_gmmen_Mms.txt", "GMMenores-Mms");
                    readDocumentSamples("sample_gmmen_Mms2.txt", "GMMenores-Mms");
                    readDocumentSamples("sample_gmmen_Mms3.txt", "GMMenores-Mms");
                break;
                case '5': // Seguro Dental - dental
                    console.log("DENTAL_SAMPLES");
                    readDocumentSamples("sample_dental_Dentalia.txt", "Dental-Dentalia");
                    readDocumentSamples("sample_dental_Dentalia2.txt", "Dental-Dentalia");
                    readDocumentSamples("sample_dental_Dentalia3.txt", "Dental-Dentalia");
                    readDocumentSamples("sample_dental_Dentegra.txt", "Dental-Dentegra");
                    readDocumentSamples("sample_dental_Dentegra2.txt", "Dental-Dentegra");
                    readDocumentSamples("sample_dental_Dentegra3.txt", "Dental-Dentegra");
                break;
                case '6': // Vida - vida
                    console.log("Vida_Samples");
                    readDocumentSamples("sample_vida_Gnp.txt", "Vida-Gnp");
                    readDocumentSamples("sample_vida_Gnp2.txt", "Vida-Gnp");
                    readDocumentSamples("sample_vida_Gnp3.txt", "Vida-Gnp");
                break;
                case '7': // Gastos Funerarios - funeral
                    console.log("Funerario_Samples");
                    readDocumentSamples("sample_funerario_Thona.txt", "Funerario-Thona");
                    readDocumentSamples("sample_funerario_Thona2.txt", "Funerario-Thona");
                    readDocumentSamples("sample_funerario_Thona3.txt", "Funerario-Thona");
                break;
                case '8': // Accidentes Personales - ap
                
                break;
                case '9': // Vida Deudor - NULL
                
                break;
                case '10': // Daños Casa  - casa
                    console.log("Hogar_Samples");
                    readDocumentSamples("sample_hogar_Chubb.txt", "Hogar-Chubb");
                    readDocumentSamples("sample_hogar_Chubb2.txt", "Hogar-Chubb");
                    readDocumentSamples("sample_hogar_Chubb3.txt", "Hogar-Chubb");
                    readDocumentSamples("sample_hogar_Zurich.txt", "Hogar-Zurich");
                    readDocumentSamples("sample_hogar_Zurich2.txt", "Hogar-Zurich");
                    readDocumentSamples("sample_hogar_Zurich3.txt", "Hogar-Zurich");
                break;
                case '11': // Excesos GMM - excesos
                
                break;
                case '12': // Ambulancia - ambulancia
                
                break;
                case '13': // Daños Activos - daños
                
                break;
                default:
        }
    }

    for(i=0; i < classifyDocsType.body.length; i++){
        for(j=0; j < 3; j++){
            //console.log(`sample_${classifyDocsType.body[i].id}_${classifyDocsType.body[i].name}_${j}.txt`);
            readDocumentSamples(`sample_${classifyDocsType.body[i].id}_${classifyDocsType.body[i].name}_${j}.txt`);
        }
    }

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
    await readSamplesInit();
    await fnTrainingDataIA();
    await fnTestClassification();
    await fnLoadingClassification();
}

module.exports = {
    readDocumentSamples,
    readSamplesInit,
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