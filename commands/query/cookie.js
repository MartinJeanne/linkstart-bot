var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'discord'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL !");
});

module.exports = {
    me: function (message) {
        connection.query(`SELECT userId,amount FROM cookies WHERE userId = '${message.author}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) {
                let given = result[0].amount + 1;
                connection.query(`UPDATE cookies SET amount = ${given} WHERE userId = '${message.author}';`, function (err, result) {
                    if (err) throw err;
                });
            }
            else {
                connection.query(`INSERT INTO cookies (userId, userTag, amount) VALUES ('${message.author}', '${message.author.tag}', 1);`, function (err, result) {
                    if (err) throw err;
                });
            }
        });
    },

    amount: function (message, callback) {
        connection.query(`SELECT amount FROM cookies WHERE userId = '${message.author}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) { return callback(result[0].amount); }
            return callback(0);
        });
    },
}