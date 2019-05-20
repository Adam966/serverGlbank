module.exports = {
    
    getAccount() {
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
    }
}