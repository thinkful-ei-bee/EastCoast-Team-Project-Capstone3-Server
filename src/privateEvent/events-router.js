const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const EventService = require('./events-service')
const path = require('path')
const EventRouter = express.Router()


EventRouter
  .route('/')  
  .get(requireAuth,(req,res,next)=>{

    EventService.getAllPublicEvents(
      req.app.get('db')
      ,req.user.id
    )
    .then(events=>{
      console.log(events,'test')
      res.json(events)
    })
    .catch(next)    
  })
  .post(requireAuth,jsonBodyParser,(req,res,next)=>{
    const{event_name,event_date,event_time,event_location,event_details,is_private} = req.body
    const newEvent = {event_name,event_date,event_time,event_location,event_details,is_private}
    newEvent.event_owner_id = req.user.id
    for(const [key,value] of Object.entries(newEvent))
      if(value===null)
        return res.status(400).json({
          error:`Missing ${key} in the request body`
        })
    EventService.insertEvent(
      req.app.get('db'),
      newEvent
    )
    .then(event=>{
      res
        .status(201)
        .location(path.posix.join(req.originalUrl,`/${event.id}`))
        .json(event)
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