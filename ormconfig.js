require('dotenv/config');
const { SnakeCaseNamingStrategy } = require('./dist/lib/name-strategy.js');

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: process.env.DB_LOG == "1",
    namingStrategy: new SnakeCaseNamingStrategy(),
    entities: [
        'dist/**/*.entity.js'
    ],
    migrations: [
        'dist/migrations/**/*.js'
    ],
    cli: {
        migrationsDir: 'src/migrations'
    }
}