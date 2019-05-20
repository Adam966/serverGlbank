const express = require('express');
const bodyParser = require('body-parser');

const database = require('./database');

const account = require('./models/accounts');
const client = require('./models/client');
const accInfo = require('./models/accInfo');

database.authenticate()
    .then(() => console.log("Database started."))
    .catch(err => console.log("Error: " + err))

const app = express();
app.use(bodyParser.json()) 
const PORT = 8081;

/////////////////////////////////////// LOGIN ///////////////////////////////////////
app.post('/login', (req, res) => {    
        client.findAll({
        where: {
            login: req.body.name,
            password: req.body.password
        }
    })
    .then(client => {
        res.status(200).send(client);
    })
    .catch(err => console.log(err));
});

/////////////////////////////////////// ACCOUNTS ///////////////////////////////////////
app.post('/accounts', (req, res) => {    
    account.findAll({
    where: {
        idclient: req.body.id,
    }
})
.then(account => {
    res.status(200).send(account);
})
.catch(err => console.log(err));
});

/////////////////////////////////////// ACCINFO ///////////////////////////////////////
app.post('/accInfo', (req, res) => {    
    accInfo.findAll({
    where: {
        accNum: req.body.accNum
    }
})
.then(accInfo => {
    res.status(200).send(accInfo);
})
.catch(err => console.log(err));
});

/////////////////////////////////////// TRANS HISTORY ///////////////////////////////////////


app.listen(PORT, console.log('Server started ' + PORT));