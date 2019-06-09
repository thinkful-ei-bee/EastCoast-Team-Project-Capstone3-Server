const xss = require('xss')

const EventService ={
  getAllPublicEvents(db){
    return db 
      .from('events')
      .select('*')   
      .where('is_private',false)   
  },
  
  getAllPrivateEvents(db){
    return db 
      .from('events')
      .select('*')
      .where('is_private',true)
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