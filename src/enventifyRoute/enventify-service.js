const xss = require('xss')

const EventifyService ={
  getAllEventifiedLog(db){
    return db 
      .from('eventify_log AS el')
      .select(
        'el.id',
        'el.sender_id',
        'el.recipient_id',
        'el.date_created',
        'el.event',
        'el.is_accept',
        'up.profile_picture',
        'up.music_like',
        'up.movie_like',
        'up.me_intro',
        'up.age',
        'evs.event_name',
        'evs.event_date',
        'evs.event_time',
        'evs.event_location',
        'evs.is_private',
        'usr.gender',
        'usr.full_name')
      .join('user_profile AS up','up.user_id','el.sender_id')         
      .join('events AS evs','evs.id','el.event')
      .join('users AS usr','el.sender_id','usr.id'
      )
      
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
    console.log(newEventified)
    //return db('eventify_log')

      // .where({id})
      // .update(newEventified)
  },

  deleteEvent(db,id){
    return db 
      .from('eventify_log')
      .where({id})
      .delete()
  },


}

module.exports = EventifyService