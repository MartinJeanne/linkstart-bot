var mysql = require('mysql');

var bdd = mysql.createPool({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bde9cf4f063788',
    password: 'b891c331',
    database: 'heroku_584b0ee0edf98c7'
});

bdd.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL !");
});

module.exports = {
    me: function (message) {
        bdd.query(`SELECT userId,amount FROM cookies WHERE userId = '${message.author}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) {
                let given = result[0].amount + 1;
                bdd.query(`UPDATE cookies SET amount = ${given} WHERE userId = '${message.author}';`, function (err, result) {
                    if (err) throw err;
                });
            }
            else {
                bdd.query(`INSERT INTO cookies (userId, userTag, amount) VALUES ('${message.author}', '${message.author.tag}', 1);`, function (err, result) {
                    if (err) throw err;
                });
            }
        });
    },

    amount: function (author, callback) {
        bdd.query(`SELECT amount FROM cookies WHERE userId = '${author}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) { return callback(result[0].amount); }
            return callback(0);
        });
    },

    give: function (giver, numberToSubtract, receiver, numberToGive, ) {
        bdd.query(`SELECT amount FROM cookies WHERE userId = '${receiver}';`, function (err, result) {
            if (err) throw err;
            // If user to give is albready in BDD
            if (typeof result !== 'undefined' && result.length > 0) {
                bdd.query(`UPDATE cookies SET amount = ${numberToGive} WHERE userId = '${receiver}';`, function (err, result) {
                    if (err) throw err;
                });
            }
            else {
                bdd.query(`INSERT INTO cookies (userId, userTag, amount) VALUES ('${receiver}', '${receiver.tag}', ${numberToGive});`, function (err, result) {
                    if (err) throw err;
                });
            }
        });

        // Subtract the amount of cookies of the giver
        bdd.query(`UPDATE cookies SET amount = ${numberToSubtract} WHERE userId = '${giver}';`, function (err, result) {
            if (err) throw err;
        });
    }
}