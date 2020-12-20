var mysql = require('mysql');
const { bdd_password } = require('../../ressources/config.json'); // LOCAL

module.exports = {
    connectDB: function () {
        var bdd = mysql.createPool({
            host: 'freedb.tech',
            user: 'freedbtech_garwalle',
            password: bdd_password, //process.env.BDD_PASSWORD (REMOTE)
            database: 'freedbtech_Garwallou'
        });
        return bdd;
    }
}