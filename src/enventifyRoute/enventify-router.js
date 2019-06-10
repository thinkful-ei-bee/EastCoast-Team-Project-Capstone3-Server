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

module.exports =EventifyRouter
