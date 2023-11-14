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

console.log('Creando registros...');

// AUTOS SAMPLES
fs.readFile(__dirname + "/src/documents/sample_auto_Banorte.txt", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Automóviles-Flotilla');
    }
});

fs.readFile(__dirname + "/src/documents/sample_auto_Chubb.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Automóviles-Flotilla');
    }
});

fs.readFile(__dirname + "/src/documents/sample_auto_Gnp.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Automóviles-Flotilla');
    }
});

fs.readFile(__dirname + "/src/documents/sample_auto_Primero.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Automóviles-Flotilla');
    }
});

fs.readFile(__dirname + "/src/documents/sample_auto_Qualitas.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Automóviles-Flotilla');
    }
});

// DENTAL SAMPLES
fs.readFile(__dirname + "/src/documents/sample_dental_Dentalia.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Dental');
    }
});

fs.readFile(__dirname + "/src/documents/sample_dental_Dentegra.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Dental');
    }
});

// GMM Samples
fs.readFile(__dirname + "/src/documents/sample_gmm_Atlas.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMM');
    }
});

fs.readFile(__dirname + "/src/documents/sample_gmm_Axxa.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMM');
    }
});

fs.readFile(__dirname + "/src/documents/sample_gmm_Gnp.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMM');
    }
});

fs.readFile(__dirname + "/src/documents/sample_gmm_Metlife.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMM');
    }
});

// GMMenores Samples
fs.readFile(__dirname + "/src/documents/sample_gmmen_MediAccess.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMMenores');
    }
});

fs.readFile(__dirname + "/src/documents/sample_gmmen_Mms.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'GMMenores');
    }
});

// Hogar Samples
fs.readFile(__dirname + "/src/documents/sample_hogar_Chubb.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Hogar');
    }
});

fs.readFile(__dirname + "/src/documents/sample_hogar_Zurich.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Hogar');
    }
});

// Vida Samples
fs.readFile(__dirname + "/src/documents/sample_vida_Gnp.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Vida');
    }
});

// Funerario Samples
fs.readFile(__dirname + "/src/documents/sample_funerario_Thona.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        classifier.addDocument(data, 'Funerario');
    }
});
console.log("Read Sample files content ✅");

console.log('Training IA...');
classifier.train();

console.log('Realizando prueba de clasificación...');
fs.readFile(__dirname + "/src/documents/test_gmm_Gnp.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        console.log( classifier.classify(data) );
    }
});

fs.readFile(__dirname + "/src/documents/test_gmm_Axxa.txt", "utf-8", (err, data) => {
    if (err){
        console.log(err);
    } else {
        console.log( classifier.classify(data) );
    }
});

console.log('Saving Classifications...');
classifier.save('clasificaciones.json');

console.log('Loading Classifications...');
natural.BayesClassifier.load('clasificaciones.json', null, function(err, classifier) {
    fs.readFile(__dirname + "/src/documents/test_gmm_Axxa2.txt", "utf-8", (err, data) => {
        if (err){
            console.log(err);
        } else {
            console.log(classifier.classify(data));
        }
    });

    fs.readFile(__dirname + "/src/documents/test_gmm_Axxa3.txt", "utf-8", (err, data) => {
        if (err){
            console.log(err);
        } else {
            console.log(classifier.getClassifications(data));
        }
    });
});

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