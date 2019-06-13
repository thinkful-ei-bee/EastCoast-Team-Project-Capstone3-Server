const xss = require('xss')

const EventService ={
  getAllEventsCurrentUser(db,id){
    return db 
      .from('events')
      .select('*')         
      .where('event_owner_id',id)
  },
  
  getAllEvents(db){
    return db 
    .from('events')
    .select('*')         
  },

  
  getById(db,id){
    return db
      .from('events')
      .select('*')
      .where('id',id)
      .first()
  },

  insertEvent(db,newEvent){
    return db
      .insert(newEvent)
      .into('events')
      .returning('*')
  },

  updateEvent(db,id,eventToUpdate){
    return db('events')
      .where({id})
      .update(eventToUpdate)
  },

  deleteEvent(db,id){
    return db 
      .from('events')
      .where({id})
      .delete()
  },

  serializeEvent(event){
    return{
      id:event.id,      
      event_name:xss(event.event_name),
      event_date:event.event_date,
      event_time:event.event_time,      
      event_location:xss(event.event_location),
      event_details:xss(event.event_details),
      event_owner_id:event.event_owner_id      
    }
  },
}

module.exports = EventService