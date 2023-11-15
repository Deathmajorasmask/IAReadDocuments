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
    readDocumentSamples("/src/documents/sample_auto_Banorte.txt", "Automóviles-Flotilla");
    readDocumentSamples("/src/documents/sample_auto_Chubb.txt", "Automóviles-Flotilla");
    readDocumentSamples("/src/documents/sample_auto_Gnp.txt", "Automóviles-Flotilla");
    readDocumentSamples("/src/documents/sample_auto_Primero.txt", "Automóviles-Flotilla");
    readDocumentSamples("/src/documents/sample_auto_Qualitas.txt", "Automóviles-Flotilla");
    // DENTAL SAMPLES
    readDocumentSamples("/src/documents/sample_dental_Dentalia.txt", "Dental");
    readDocumentSamples("/src/documents/sample_dental_Dentegra.txt", "Dental");
    // GMM Samples
    readDocumentSamples("/src/documents/sample_gmm_Atlas.txt", "GMM");
    readDocumentSamples("/src/documents/sample_gmm_Gnp.txt", "GMM");
    readDocumentSamples("/src/documents/sample_gmm_Axxa.txt", "GMM");
    readDocumentSamples("/src/documents/sample_gmm_Metlife.txt", "GMM");
    // GMMenores Samples
    readDocumentSamples("/src/documents/sample_gmmen_MediAccess.txt", "GMMenores");
    readDocumentSamples("/src/documents/sample_gmmen_Mms.txt", "GMMenores");
    // Hogar Samples
    readDocumentSamples("/src/documents/sample_hogar_Chubb.txt", "Hogar");
    readDocumentSamples("/src/documents/sample_hogar_Zurich.txt", "Hogar");
    // Vida Samples
    readDocumentSamples("/src/documents/sample_vida_Gnp.txt", "Vida");
    // Funerario Samples
    readDocumentSamples("/src/documents/sample_funerario_Thona.txt", "Funerario");
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
    var texto = req.body.resultText;
    console.log(texto);
    res.render(__dirname + "/public/classify-text.html", {texto:texto});
});

app.listen(app.get('port'), ()=>{
    console.log('App listening in port ' + app.get('port'))
})