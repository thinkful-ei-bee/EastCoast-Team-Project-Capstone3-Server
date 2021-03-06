console.log(process.env.PORT);
module.exports = {
  CLIENT_ORIGIN : process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  //CLIENT_ORIGIN : process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL
    || 'postgresql://dunder-mifflin@localhost/rendezvous',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}