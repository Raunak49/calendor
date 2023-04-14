const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require('dotenv').config();
const dbUrl = process.env.DB_URL;
const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect(dbUrl, {
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
