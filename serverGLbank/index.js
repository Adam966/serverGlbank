const express = require('express');
const expHandle = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const database = require('./database');
const account = require('./models/account');

database.authenticate()
    .then(() => console.log("Database started."))
    .catch(err => console.log("Error: " + err))

const app = express();
const PORT = 8081;

app.get('/account', (req, res) => {
    account.findAll({
        where: {
            idclient: 3
        }
    })
    .then(account => {
        res.send(account);
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
});

app.get('/hello', (req, res) => {
    console.log('Hello');
});
  

app.listen(PORT, console.log('Server started ' + PORT));