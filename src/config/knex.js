const pg = require('knex')({
    client: 'pg',
    connection: {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
    },
    searchPath: ['knex', 'public'],
});

module.exports = pg;