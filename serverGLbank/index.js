const express = require('express');
const bodyParser = require('body-parser');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

const database = require('./database');

const account = require('./models/accounts');
const client = require('./models/client');
const accInfo = require('./models/accInfo');
const accTrans = require('./models/accTrans');
const cards = require('./models/cards');
const cardInfo = require('./models/cardInfo');
const cardTrans = require('./models/cardTrans');

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
        uidgen.generate()
        .then(uid => {
            let obj = new Object();
            obj.client = client,
            obj.token = uid
            res.status(200).send(obj);
        });
    })
    .catch(err => console.log(err));
});

///////////////////////////////////// LOG OUT ///////////////////////////////////////
app.post('/logout', (req, res) => {    
    res.status(200).send("Log out");
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
        AccNum: req.body.accNum
    }
})
.then(accInfo => {
    res.status(200).send(accInfo);
})
.catch(err => console.log(err));
});

/////////////////////////////////////// TRANS HISTORY ///////////////////////////////////////
app.post('/transHistory', (req, res) => {    
    accTrans.findAll({
    where: {
        IDAccount: req.body.accID
    }
})
.then(accTrans => {
    res.status(200).send(accTrans);
})
.catch(err => console.log(err));
});

///////////////////////////////////// CARDS ///////////////////////////////////////
app.post('/cards', (req, res) => {    
    cards.findAll({
    where: {
        IDAccount: req.body.accID
    }
})
.then(cards => {
    res.status(200).send(cards);
})
.catch(err => console.log(err));
});

///////////////////////////////////// CARD INFO ///////////////////////////////////////
app.post('/cardInfo', (req, res) => {    
    cardInfo.findAll({
    where: {
        cardNum: req.body.cardNum
    }
})
.then(cardInfo => {
    res.status(200).send(cardInfo);
})
.catch(err => console.log(err));
});

///////////////////////////////////// CARD TRANS ///////////////////////////////////////
app.post('/cardTrans', (req, res) => {    
    cardTrans.findAll({
    where: {
        IDCard: req.body.IDCard
    }
})
.then(cardTrans => {
    res.status(200).send(cardTrans);
})
.catch(err => console.log(err));
});

app.listen(PORT, console.log('Server started ' + PORT));