const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    next();
}); 

const PORT = 8081;

let LoggedIn = new Array();
/////////////////////////////////////// CHECK LOGIN ///////////////////////////////////////
const checkLogin = (obj) => {
    LoggedIn.forEach((item) => {
        if(item.token === obj)
            return true;
        else
            return false
    })

};

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
                obj.client = client[0];
                obj.token = uid;
                res.status(200).send(obj);
        
                let logIn = new Object();
                logIn.name = req.body.name;
                logIn.token = uid;
                LoggedIn.push(logIn);
            })
    })
    .catch(err => console.log(err));
});               

///////////////////////////////////// LOG OUT ///////////////////////////////////////
app.post('/logout', (req, res) => { 
    LoggedIn.map((client, index) => {
        if(client.token == req.body.token) {
            LoggedIn.splice(index, 1);
            res.status(200).send("Log out");
        }          
    }); 
});

/////////////////////////////////////// ACCOUNTS ///////////////////////////////////////
app.post('/accounts', (req, res) => { 
    // if(checkLogin(req.body.token)) {
        account.findAll({
            where: {
                idclient: req.body.id,
            },
            })
            .then(account => {
                res.status(200).send(account);
            })
            .catch(err => console.log(err));
/*     } else {
        res.status(403).send("Not valid token");
    } */
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

//////////////////////////////////// CREATE TRANS ///////////////////////////////////////
app.put('/trans', (req, res) => {
    accTrans.create({
        transamount: req.body.transamount,
        transdate: req.body.transdate,
        recaccount: req.body.recaccount,
        type: req.body.type,
        idaccount: req.body.idaccount
    })
    accInfo.update({
        amount: req.body.balance
    },
    {
        where: {
            id: req.body.idaccount
        }
    })
    .then(() => {
        res.status(200).send('Data are written');
    })
});

//////////////////////////////////// BLOCK CARD ///////////////////////////////////////
app.put('/block', (req, res) => {
    cardInfo.update({
        active: req.body.status,
    }, 
    {
        where: {
            cardnum: req.body.cardnum
        }
    })
    .then(() => {
        res.status(200).send('Card is blocked')
    })
})

app.listen(PORT, console.log('Server started ' + PORT));