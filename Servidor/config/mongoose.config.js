const mongoose = require('mongoose');
const BbName = 'restaurantesDB';

//Promesa
mongoose.connect(`mongodb://localhost/${BbName}`, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})