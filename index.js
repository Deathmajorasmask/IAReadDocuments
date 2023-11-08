const express = require('express')
const app = express()
const path = require('path')

// Natural IA See Documentation: https://github.com/NaturalNode/natural
const natural = require('natural')
const classifier = new natural.BayesClassifier();

console.log('Creando registros...');
classifier.addDocument('Advertencia: Hubo una falla en el servidor 45', 'advertencia');
classifier.addDocument('Error en la VPN 45', 'error');
classifier.addDocument('El usuario root intentó loguear con error', 'error');
classifier.addDocument('Se conectó un usuario a la red interna', 'informativo');
classifier.addDocument('Precaución en el servidor 560, el uso de CPU está al 80%', 'advertencia');
classifier.addDocument('Se detectó alta latencia en el servidor 893, revisar la conexión con fallas', 'advertencia');
classifier.addDocument('Guardado el registro de la última hora de accesos a la VPN', 'informativo');
classifier.addDocument('La máquina virtual 431 fue apagada exitosamente', 'informativo');
classifier.addDocument('El usuario mi_empresa accedió por SSH exitosamente al servidor 33', 'informativo');
classifier.addDocument('Error crítico en el servidor HTTP principal, cantidad de errores 500 excedido a lo permitido', 'error');
classifier.addDocument('El servidor 15 presentó un error en el sistema operativo y se apagó inesperadamente.', 'error');

console.log('Entrenando...');
classifier.train();

console.log('Realizando prueba de clasificación...');
console.log(classifier.classify('La máquina virtual 510 tiene el uso de disco duro al 90%'));
console.log(classifier.classify('El servidor 333 presentó un error en hardware terminando con BSOD'));

console.log('Guardando clasificaciones...');
classifier.save('clasificaciones.json');

console.log('Cargando clasificaciones...');
natural.BayesClassifier.load('clasificaciones.json', null, function(err, classifier) {
  console.log(classifier.classify('El usuario 615 se desconectó del SSH correctamente'));
  console.log(classifier.classify('La VPN 116 fue agregada con éxito'));
  console.log(classifier.classify('Servidores del rack 15 con alta latencia'));
  console.log(classifier.getClassifications('La máquina virtual 612 falló inesperadamente'));
});

// Settings
app.set('port', 3000)

// Middleware
app.use(express.static(path.join(__dirname,'public')))

// Routes
app.get('/', (req, res)=>{
    res.send('Welcome! :)')
})

app.listen(app.get('port'), ()=>{
    console.log('App listening in port ' + app.get('port'))
})