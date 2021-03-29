var mysql      = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    port     :'3306',
    user     : 'ankit',
    password : '1998',
    database : 'todo',
    insecureAuth : true,
    multipleStatements: true
})

module.exports = pool
   