const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const EventifyService = require('./enventify-service')
const path = require('path')
const EventifyRouter = express.Router()

EventifyRouter
  .route('/')
  .get(requireAuth,(req,res,next)=>{
    EventifyService.getAllEventifiedLog(
      req.app.get('db')
    )
    .then(eventify=>{
      res.json(eventify)
    })
  })

  .post(requireAuth,jsonBodyParser,(req,res,next)=>{
    // event here is event_id, make a mistake on migration file.
    const {recipient_id,event}=req.body
    const newEventify = {recipient_id,event}
    newEventify.sender_id = req.user.id    
      for(const [key,value] of Object.entries(newEventify))
        if(value == null)
          return res.status(400).json({
            error:`Missing '${key}' in request body`
          })
      EventifyService.insertEventified(
        req.app.get('db'),
        newEventify
      )      
      .then(eventify=>{
        res
          .status(201)
          .location(path.posix.join(req.originalUrl),`/${eventify.id}`)
          .json(eventify)
      })
      .catch(next)
    })

EventifyRouter
.route('/:eventify_id')
.all(requireAuth)
.all((req, res, next) => {
  EventifyService.getById(
    req.app.get('db'),
    req.params.eventify_id
  )
  .then(eventify=>{
    if(!eventify){
      return res.status(404).json(
        {error:{message:`eventify doesn't exist`}}
      )
    }
    res.eventify = eventify
    next()
    return eventify
  })
  .catch(next)
})
.get(requireAuth)
.get((req, res, next) => {
  res.json(res.eventify)
})
.delete(requireAuth,(req,res,next)=>{
  EventifyService.deleteEvent(
    req.app.get('db'),
    req.params.eventify_id
  )
  .then(eventify => {
    res.status(204).send('Successfully delete')
  })
  .catch(next)
})
.patch(requireAuth, jsonBodyParser, (req, res, next) => {
  const { recipient_id,event } = req.body
  const eventifyToUpdate = { recipient_id,event }

  const numValues = Object.values(eventifyToUpdate).filter(Boolean).length
  if (numValues === 0)
    return res.status(400).json({ error: { message: 'Must not be blank '}})

  EventifyService.updateEvent(
    req.app.get('db'),
    req.params.eventify_id,
    eventifyToUpdate
    )
    .then(eventify => {
      res.status(200).json(eventifyToUpdate)
    })
    .catch(next)
})

module.exports = EventifyRouter
