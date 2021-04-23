var mysql = require('mysql');
//const { bdd_password } = require('../../ressources/config.json'); // (LOCAL)

module.exports = {
    connectDB: function () {
        var bdd = mysql.createPool({
            host: 'freedb.tech',
            database: 'freedbtech_GarwallouBot',
            user: 'freedbtech_Garwalle',
            password: process.env.BDD_PASSWORD, // (REMOTE)
            //password: bdd_password // (LOCAL)
        });
        return bdd;
    }
}