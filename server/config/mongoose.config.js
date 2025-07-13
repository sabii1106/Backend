const mongoose = require('mongoose');
const BbName = 'SanJose';

//Promesa
mongoose.connect(`mongodb://127.0.0.1:27017/${BbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log(`Conectado a la base de datos ${BbName}`);
    })
    .catch((error) => {
    console.error(`Error al conectar a la base de datos ${BbName}:`, error);
    });