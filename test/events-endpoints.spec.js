const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Events Endpoints', function () {
  let db
  let events = [
      {
        id: 1,
        event_name: 'test-event-1',
        event_date: 'test-event-date-1',
        event_time: '12:00pm,',
        event_details: 'test event details 1',
        event_owner_id: 1,
        is_private: false, 
        date_created: 'date created'
      },
      {
        id: 2,
        event_name: 'test-event-2',
        event_date: 'test-event-date-2',
        event_time: '1:00pm,',
        event_details: 'test event details 2',
        event_owner_id: 2,
        is_private: false, 
        date_created: 'date created'
      }
    ]

  const testEvents = helpers.makeEventsArray()
  const testEvent = testEvents[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db.raw('TRUNCATE TABLE events RESTART IDENTITY;'))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /events/all-event`, () => {

    beforeEach('insert some events', () => {
      return db('events').insert(events);
    })

    it('should respons to GET `/events/all-event` with an array of events and a status 200', () => {
      return supertest(app)
        .get('/events/all-event')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array')
          expect(res.body).to.have.length(events.length)
          res.body.forEach(event => {
            expect(event).to.be.a('object')
            expect(event).to.include.keys('id', 'event_name', 'event_date', 'event_time', 'event_details', 'event_owner_id', 'is_private', 'date_created')
          })
        })
    });
  })
})