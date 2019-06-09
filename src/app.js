require('dotenv').config()
const express = require('express')
const { NODE_ENV } = require('./config')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const authRouter = require('./auth/auth-router')
const errorHandler = require('./middleware/error-handler')
const EventRouter = require('./privateEvent/events-router')
const usersRouter = require('./users/users-router')

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))

app.use(cors())
app.use(helmet())




// app.get('/',(req,res)=>{
//   res.send('Hello, world!')
// })


app.use('/api/events',EventRouter)
app.use('/api/users',usersRouter)
app.use('/api/auth',authRouter)
app.use(errorHandler)

module.exports = app