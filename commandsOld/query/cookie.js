connection = require('./connection.js');
const bdd = connection.connectDB();

module.exports = {
    me: function (message) {
        bdd.query(`SELECT userId,amount FROM cookies WHERE userId = '${message.author}' AND guildId = '${message.guild.id}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) {
                let given = result[0].amount + 1;
                bdd.query(`UPDATE cookies SET amount = ${given} WHERE userId = '${message.author}' AND guildId = '${message.guild.id}';`, function (err, result) {
                    if (err) throw err;
                });
            }
            else {
                bdd.query(`INSERT INTO cookies (userId, guildId, userTag, amount) VALUES ('${message.author}', ${message.guild.id}, '${message.author.tag}', 1);`, function (err, result) {
                    if (err) throw err;
                });
            }
        });
    },

    amount: function (author, guildId, callback) {
        bdd.query(`SELECT amount FROM cookies WHERE userId = '${author}' AND guildId = '${guildId}';`, function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined' && result.length > 0) { return callback(result[0].amount); }
            return callback(0);
        });
    },

    give: function (giver, newGiverAmount, receiver, newReceiverAmount, guildId) {
        bdd.query(`SELECT amount FROM cookies WHERE userId = '${receiver}' AND guildId = '${guildId}';`, function (err, result) {
            if (err) throw err;
            // If user to give is albready in BDD
            if (typeof result !== 'undefined' && result.length > 0) {
                bdd.query(`UPDATE cookies SET amount = ${newReceiverAmount} WHERE userId = '${receiver}' AND guildId = '${guildId}';`, function (err, result) {
                    if (err) throw err;
                });
            }
            else {
                bdd.query(`INSERT INTO cookies (userId, guildId, userTag, amount) VALUES ('${receiver}', '${guildId}', '${receiver.tag}', ${newReceiverAmount});`, function (err, result) {
                    if (err) throw err;
                });
            }
        });

        // Subtract the amount of cookies of the giver
        bdd.query(`UPDATE cookies SET amount = ${newGiverAmount} WHERE userId = '${giver}' AND guildId = '${guildId}';`, function (err, result) {
            if (err) throw err;
        });
    }
}