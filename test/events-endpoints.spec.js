const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Events Endpoints', function () {
  let db

  const{
    testUsers, 
    testEvents
  } = helpers.makeEventsFixtures();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /events/all-event`, () => {

    beforeEach('insert some events and users', () => {
      return helpers.seedEventsTables(
        db,
        testUsers,
        testEvents
      )
    })

    it('should respons to GET `/events/all-event` with an array of events and a status 200', () => {
      // const expectedEvents = testEvents.map(event => 
      //   helpers.makeEventsArray)
      
      return supertest(app)
        .get('/api/events/all-event')
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