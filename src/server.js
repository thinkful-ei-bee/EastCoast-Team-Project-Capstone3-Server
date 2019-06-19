const app = require('./app')
const knex = require('knex')
require('dotenv').config();
//const PORT = process.env.PORT || 8000
const { PORT, DB_URL } = require('./config')
console.log(DB_URL);
const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(process.env.MIGRATION_DB_NAME,'test database name')
  console.log(`Server listening at http://localhost:${PORT}`)
})

