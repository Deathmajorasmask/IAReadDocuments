// Express routing module
const express = require('express')
const fileUpload = require("express-fileupload");

// Pdf Reading module
const pdfParse = require("pdf-parse");
const bodyParser = require("body-parser");

// Variable app
const app = express();
const path = require('path');

// fs module
const fs = require("fs");

// Natural IA See Documentation: https://github.com/NaturalNode/natural
const natural = require('natural')
const classifier = new natural.BayesClassifier();

// Settings
app.set('port', 3000)

// Middleware
app.use(express.static(path.join(__dirname,'public')))
app.engine('html', require('ejs').renderFile);
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: false}));

main();
async function readDocumentSamples(dirFile, typeFile){
    const data = fs.readFileSync(__dirname + dirFile, {encoding: 'utf8'});
    classifier.addDocument(data, typeFile);
    return data;
}

async function readSamples(){
    console.log('Creando registros...');
    // AUTOS SAMPLES
    readDocumentSamples("/src/documents/sample_auto_Banorte.txt", "Automóviles-Flotilla-Banorte");
    readDocumentSamples("/src/documents/sample_auto_Banorte2.txt", "Automóviles-Flotilla-Banorte");
    readDocumentSamples("/src/documents/sample_auto_Banorte3.txt", "Automóviles-Flotilla-Banorte");
    readDocumentSamples("/src/documents/sample_auto_Chubb.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("/src/documents/sample_auto_Chubb2.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("/src/documents/sample_auto_Chubb3.txt", "Automóviles-Flotilla-Chubb");
    readDocumentSamples("/src/documents/sample_auto_Gnp.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("/src/documents/sample_auto_Gnp2.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("/src/documents/sample_auto_Gnp3.txt", "Automóviles-Flotilla-Gnp");
    readDocumentSamples("/src/documents/sample_auto_Primero.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("/src/documents/sample_auto_Primero2.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("/src/documents/sample_auto_Primero3.txt", "Automóviles-Flotilla-Primero");
    readDocumentSamples("/src/documents/sample_auto_Qualitas.txt", "Automóviles-Flotilla-Qualitas");
    readDocumentSamples("/src/documents/sample_auto_Qualitas2.txt", "Automóviles-Flotilla-Qualitas");
    readDocumentSamples("/src/documents/sample_auto_Qualitas3.txt", "Automóviles-Flotilla-Qualitas");
    // DENTAL SAMPLES
    readDocumentSamples("/src/documents/sample_dental_Dentalia.txt", "Dental-Dentalia");
    readDocumentSamples("/src/documents/sample_dental_Dentalia2.txt", "Dental-Dentalia");
    readDocumentSamples("/src/documents/sample_dental_Dentalia3.txt", "Dental-Dentalia");
    readDocumentSamples("/src/documents/sample_dental_Dentegra.txt", "Dental-Dentegra");
    readDocumentSamples("/src/documents/sample_dental_Dentegra2.txt", "Dental-Dentegra");
    readDocumentSamples("/src/documents/sample_dental_Dentegra3.txt", "Dental-Dentegra");
    // GMM Samples
    readDocumentSamples("/src/documents/sample_gmm_Atlas.txt", "GMM-Atlas");
    readDocumentSamples("/src/documents/sample_gmm_Atlas2.txt", "GMM-Atlas");
    readDocumentSamples("/src/documents/sample_gmm_Atlas3.txt", "GMM-Atlas");
    readDocumentSamples("/src/documents/sample_gmm_Gnp.txt", "GMM-Gnp");
    readDocumentSamples("/src/documents/sample_gmm_Gnp2.txt", "GMM-Gnp");
    readDocumentSamples("/src/documents/sample_gmm_Gnp3.txt", "GMM-Gnp");
    readDocumentSamples("/src/documents/sample_gmm_Axxa.txt", "GMM-Axxa");
    readDocumentSamples("/src/documents/sample_gmm_Axxa2.txt", "GMM-Axxa");
    readDocumentSamples("/src/documents/sample_gmm_Axxa3.txt", "GMM-Axxa");
    readDocumentSamples("/src/documents/sample_gmm_Metlife.txt", "GMM-Metlife");
    readDocumentSamples("/src/documents/sample_gmm_Metlife2.txt", "GMM-Metlife");
    readDocumentSamples("/src/documents/sample_gmm_Metlife3.txt", "GMM-Metlife");
    // GMMenores Samples
    readDocumentSamples("/src/documents/sample_gmmen_MediAccess.txt", "GMMenores-MediAccess");
    readDocumentSamples("/src/documents/sample_gmmen_MediAccess2.txt", "GMMenores-MediAccess");
    readDocumentSamples("/src/documents/sample_gmmen_MediAccess3.txt", "GMMenores-MediAccess");
    readDocumentSamples("/src/documents/sample_gmmen_Mms.txt", "GMMenores-Mms");
    readDocumentSamples("/src/documents/sample_gmmen_Mms2.txt", "GMMenores-Mms");
    readDocumentSamples("/src/documents/sample_gmmen_Mms3.txt", "GMMenores-Mms");
    // Hogar Samples
    readDocumentSamples("/src/documents/sample_hogar_Chubb.txt", "Hogar-Chubb");
    readDocumentSamples("/src/documents/sample_hogar_Chubb2.txt", "Hogar-Chubb");
    readDocumentSamples("/src/documents/sample_hogar_Chubb3.txt", "Hogar-Chubb");
    readDocumentSamples("/src/documents/sample_hogar_Zurich.txt", "Hogar-Zurich");
    readDocumentSamples("/src/documents/sample_hogar_Zurich2.txt", "Hogar-Zurich");
    readDocumentSamples("/src/documents/sample_hogar_Zurich3.txt", "Hogar-Zurich");
    // Vida Samples
    readDocumentSamples("/src/documents/sample_vida_Gnp.txt", "Vida-Gnp");
    readDocumentSamples("/src/documents/sample_vida_Gnp2.txt", "Vida-Gnp");
    readDocumentSamples("/src/documents/sample_vida_Gnp3.txt", "Vida-Gnp");
    // Funerario Samples
    readDocumentSamples("/src/documents/sample_funerario_Thona.txt", "Funerario-Thona");
    readDocumentSamples("/src/documents/sample_funerario_Thona2.txt", "Funerario-Thona");
    readDocumentSamples("/src/documents/sample_funerario_Thona3.txt", "Funerario-Thona");
    console.log("Read Sample files content ✅");
}

async function fnTrainingDataIA(){
    console.log('Training IA...');
    classifier.train();
    console.log('Saving Classifications...');
    classifier.save('clasificaciones.json');
}

async function classifyDocumentSamples(dirFile){
    const data = fs.readFileSync(__dirname + dirFile, {encoding: 'utf8'});
    console.log( classifier.classify(data) );
    return data;
}

async function fnTestClassification(){
    console.log('Realizando prueba de clasificación...');
    classifyDocumentSamples("/src/documents/test_gmm_Gnp.txt");
    classifyDocumentSamples("/src/documents/test_gmm_Axxa.txt");
}

async function fnGetClassificationsDocumment(dirFile){
    const data = fs.readFileSync(__dirname + dirFile, {encoding: 'utf8'});
    console.log(classifier.getClassifications(data));
    return data;
}

async function fnLoadingClassification(){
    console.log('Loading Classifications...');
    natural.BayesClassifier.load('clasificaciones.json', null, function(err, classifier) {
        classifyDocumentSamples("/src/documents/test_gmm_Axxa2.txt");
        fnGetClassificationsDocumment("/src/documents/test_gmm_Axxa3.txt");
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

/* async function mainReadClassifyDoc(jsonName, data){
    await fnLoadGetClassifyDataFromJson(jsonName, data);
} */

async function main(){
    await readSamples();
    await fnTrainingDataIA();
    await fnTestClassification();
    await fnLoadingClassification();
}

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        res.send(result.text);
    });
});

app.post("/classify-text", (req, res) => {
    
   /*  let texto = fnLoadGetClassifyDataFromJson(req.body.resultText)
    console.log(texto); */
    /* let texto = mainReadClassifyDoc('clasificaciones.json',req.body.resultText)
    console.log ('Variable text: ' + texto); */
    let texto = classifier.classify(req.body.resultText)
    console.log(texto)
    //res.render(__dirname + "/public/classify-text.html", {texto:texto});}
    //const r = "{result:'"+texto+"'}"
    res.send("{result:'"+texto+"'}")
});

app.post("/file",(req,res) => {
    
    let texto = classifier.classify(req.body.resultText)
    res.send("{result:'algo'}")
})


app.listen(app.get('port'), ()=>{
    console.log('App listening in port ' + app.get('port'))
})