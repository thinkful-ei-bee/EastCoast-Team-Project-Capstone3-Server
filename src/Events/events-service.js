const EventsService = {
  getEvents(db) {
    return db
    .select ('*')
    .from('events')
  },
  getEventsById(db, event_id) {
    return db
    .from('events')
    .select('*')
    .where('event.id', event_id)
    .first()
  },
  insertEvent(db, newEvent) {
    return db
    .insert(newEvent)
    .into('events')
    .returning('*')
    .where(numRows => {
      return numRows[0]
    })
  },
  deleteEvent(db, event_id) {
    return db('event')
    .where('id', event_id)
    .delete()
  },
  updateEvent(db, event_id, newEvent) {
    return db('event')
    .where('id', event_id)
    .update(newEvent)
    .returning('*')
  }
}

module.exports = EventsService