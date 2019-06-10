const xss = require('xss')

const EventifyService ={
  getAllEventifiedLog(db){
    return db 
      .from('eventify_log')
      .select('*')         
      
  },
  
  getAllEventifedBySender(db,sender_id){
    return db 
      .from('eventify_log')
      .select('*')
      .where('sender_id',sender_id)
  },
  getAllEventifedByRecipient(db,recipient_id){
    return db 
      .from('eventify_log')
      .select('*')
      .where('recipient_id',recipient_id)
  },

  
  getById(db,id){
    return db
      .from('eventify_log')
      .select('*')
      .where('id',id)
      .first()
  },

  insertEventified(db,newEventified){
    return db
      .insert(newEventified)
      .into('eventify_log')
      .returning('*')
  },

  updateEvent(db,id,newEventified){
    return db('eventify_log')
      .where({id})
      .update(newEventified)
  },

  deleteEvent(db,id){
    return db 
      .from('eventify_log')
      .where({id})
      .delete()
  },


}

module.exports = EventifyService