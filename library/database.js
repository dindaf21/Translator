let postgres = require('pg');

let connection = postgres.createConnection({
    host: 'localhost',
    user: 'postgres',
    password: 'p@ssw0rd',
    database: 'db_latihan_express',
});

connection.connect(function(error){
    if (!!error){
        console.log('Error connecting to database');
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;