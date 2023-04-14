const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://kakkarraunak:fVvFFCke246Cmv6q@cluster0.uf6r2mm.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', require('./auth'));
app.use('/calendar', require('./calendar'));

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})
