require('dotenv').config()
const express = require('express')
const { NODE_ENV } = require('./config')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const authRouter = require('./auth/auth-router')
const errorHandler = require('./middleware/error-handler')

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))

app.use(cors())
app.use(helmet())


app.use(errorHandler)

app.get('/',(req,res)=>{
  res.send('Hello, world!')
})


module.exports = app