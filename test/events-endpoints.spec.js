const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest');

describe.skip('Events Endpoints', function () {
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

    it('should respond to GET `/events/all-event` with an array of events and a status 200', () => {
      
      return supertest(app)
        .get('/api/events/all-event')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array')
          res.body.forEach(event => {
            expect(event).to.be.a('object')
            expect(event).to.include.keys('id', 'event_name', 'event_date', 'event_time', 'event_location', 'event_details', 'event_owner_id', 'is_private', 'date_created')
            })
          })
      });
    })

    describe('GET  /api/events', () => {
      beforeEach('insert some events and users', () => {
        return helpers.seedEventsTables(
          db,
          testUsers,
          testEvents
        )
      })

      it('should return all events created by the current user', () => {
        return supertest(app)
          .get('/api/events')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.a('array')
            res.body.forEach(event => {
              expect(event).to.be.a('object')
              expect(event).to.include.keys('id', 'event_name', 'event_date', 'event_time', 'event_location', 'event_details', 'event_owner_id', 'is_private', 'date_created')
              })
            })
      })
    })

    describe('GET /api/events/:event_id', () => {
      beforeEach('insert some events and users', () => {
        return helpers.seedEventsTables(
          db,
          testUsers,
          testEvents
        )
      })

      it('should return the correct event when given an id', () => {
        let event;
        return db('events')
          .first()
          .then(_event => {
            event = _event
            return supertest(app)
              .get(`/api/events/${event.id}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
          })
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys('id', 'event_name', 'event_date', 'event_time', 'event_location', 'event_details', 'event_owner_id');
            expect(res.body.id).to.equal(event.id);
            expect(res.body.event_name).to.equal(event.event_name);
            // expect(res.body.event_date).to.equal(event.event_date);
            expect(res.body.event_time).to.equal(event.event_time);
            expect(res.body.event_location).to.equal(event.event_location);
            expect(res.body.event_details).to.equal(event.event_details);
            expect(res.body.event_owner_id).to.equal(event.event_owner_id);
          })
      })

      it('should respond with a 404 when given an invalid id', () => {
        return supertest(app)
          .get('/api/events/1000000000')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404);
      })
    })



    describe('POST /api/events', () => {
      beforeEach('insert some events and users', () => {
        return helpers.seedEventsTables(
          db,
          testUsers,
          testEvents
        )
      })

      it('should create and return a new event when provided valid data', () => {
        const testEvent = testEvents[0];
        const testUser = testUsers[0];
        const newEvent = {
          'id': testEvent.id,
          'event_name': 'test-event-1',
          'event_date': '2020-03-12',
          'event_time': '12:00:00',
          'event_details': 'test event details 1',
          'event_location': 'California',
          'event_owner_id': testUser.id, 
          'is_private': false, 
          'date_created': '2029-01-22T16:28:32.615Z'
          }

        return supertest(app)
        .post('/api/events')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newEvent)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('array')
          res.body.map(i => 
            expect(i).to.have.all.keys('id', 'event_name', 'event_date', 'event_time', 'event_details', 'event_location', 'event_owner_id', 'is_private', 'date_created'))
          expect(res.headers.location).to.equal(`/api/events/${res.body.id}`)
        })
      })

      // it('should respond with a 400 status when given bad data', () => {
      //   const badItem = {
      //     invalidData: 'baddata'
      //   }
      //   return supertest(app)
      //     .post('/api/events')
      //     .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      //     .send(badItem)
      //     .expect(400)
      // })
    })

    describe('PATCH /api/events/:event_id', () => {
      beforeEach('insert some events and users', () => {
        return helpers.seedEventsTables(
          db,
          testUsers,
          testEvents
        )
      })

      it('should update event when given valid data and an id', () => {
        const updatedEvent = {
          'event_name': 'test-event-1',
          'event_date': '2020-03-12',
          'event_time': '2:00:00',
          'event_details': 'test event details 1',
          'event_location': 'Colorado',
          'is_private': true, 
          }

          let event;
          return db('events')
            .first()
            .then(_event => {
              event = _event
              return supertest(app)
                .patch(`/api/events/${event.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updatedEvent)
                .expect(200)
            })
            .then(res => {
              expect(res.body).to.be.a('object')
              expect(res.body).to.include.keys('event_name', 'event_date', 'event_time', 'event_details', 'event_location', 'is_private')
            })
          })

      it('should respond with 400 status when given bad data', () => {
        const badData = {
          badItem: 'broken item'
        }

        return db('events')
          .first()
          .then(event => {
            return supertest(app)
              .patch(`/api/events/${event.id}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .send(badData)
              .expect(400)
          })
      })

      it('should respond with a 404 for an invalid id', () => {
        const event = {
          'event_name':'test event name'
        }
        
        return supertest(app)
          .patch(`/api/events/100000000`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(event)
          .expect(404)
      })
    })


    describe('DELETE /api/events/:event_id', () => {
      beforeEach('insert some events and users', () => {
        return helpers.seedEventsTables(
          db,
          testUsers,
          testEvents
        )
      })

      it('should delete an event by id', () => {
        return db('events')
          .first()
          .then(event => {
            return supertest(app)
            .delete(`/api/events/${event.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(204)
          })
      })
    })
  })