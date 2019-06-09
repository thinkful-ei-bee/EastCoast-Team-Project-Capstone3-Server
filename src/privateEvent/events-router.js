const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const EventService = require('./events-service')

const EventRouter = express.Router()


EventRouter
  .route('/')  
  .get(requireAuth,(req,res,next)=>{

    EventService.getAllPublicEvents(
      req.app.get('db')
    )
    .then(events=>{
      console.log(events,'test')
      res.json(events)
    })
    .catch(next)    
  })

EventRouter
  .route('/private')
  .get((req,res,next)=>{

    EventService.getAllPrivateEvents(
      req.app.get('db')
    )
    .then(events=>{
      res.json(events)
    })
    .catch(next)    
  })
  
module.exports = EventRouter