const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const EventService = require('./events-service')
const path = require('path')
const EventRouter = express.Router()


EventRouter
  .route('/')  
  .get(requireAuth,(req,res,next)=>{

    EventService.getAllEvents(
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
  .route('/:event_id')
  .all(requireAuth)
  .all((req,res,next)=>{
    EventService.getById(
      req.app.get('db'),
      req.params.event_id
    )
    .then(event=>{
      if(!event){
        return res.status(404).json({
          error:{message:`event doesn't exist`}
        })        
      }
      res.event=event
      next()
      return event
    })
    .catch(next)
  })
  .get(requireAuth)
  .get((req,res,next)=>{
    res.json(EventService.serializeEvent(res.event))
  })
  
module.exports = EventRouter