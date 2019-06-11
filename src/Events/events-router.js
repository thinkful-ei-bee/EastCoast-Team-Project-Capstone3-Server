const express = require('express')
const EventsService = require('./events-service')
const jsonParser= express.json()
const path = require('path')
const eventsRouter = express.Router()

const serializeEvent = event => ({
  id: event.id,
  event_name: xss(event.title),
})

eventsRouter
  .route('/events')
  .get((req, res, next) => {
   const db = req.app.get('db')

    EventsService.getEvents(db)
      .then(event => {
        res.status(200).json(event.map(serializeEvent))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get('db')
    const { eventName, location, date, time } = req.body
    const newEvent = { eventName, location, date }

    // todo: error checking

    EventsService.insertEvent(db, newEvent)
      .then(event => {
        res.status(201).location(path.posix.join(req.originalUrl, `/${event.id}`)).json(serializeEvent(event))
      })
      .catch(next)
  })

eventsRouter
  .route('/events/:event_id')
  .all((req, res, next) => {
    const db = req.app.get('db')

    if(isNaN(parseInt(req.params.event_id)))
      return res.status(404).json({
        error: { message: 'Invalid id'}
      })
    
    EventsService.getEventsById(db, req.params.event_id)
      .then(event => {
        if(!event) 
          return res.status(404).json({
            error: { message: 'Event does not exist.' }
          })
          res.event = event
          next()
      })
      .catch(next)
  })
  .get((res, res, next) =>  {
    res.json(serializeEvent(res.event))
  })
  .delete((req, res, next) => {
    const db = req.app.get('db')
    
    EventsService.deleteEvent(db, req.params.event_id)
      .then(res.status(203).send('Deleted'))
  })
  .patch(jsonParser,(req, res, next) => {
    const db = req.app.get('db')
    const { eventName, location, date, time } = req.body
    const newEvent = { eventName, location, date }

    // todo: error checking

    EventsService.updateEvent(db, req.params.event_id, newEvent)
      .then(event => {
        res.status(200).json(serializeEvent(event[0]))
      })
      .catch(next)
  })