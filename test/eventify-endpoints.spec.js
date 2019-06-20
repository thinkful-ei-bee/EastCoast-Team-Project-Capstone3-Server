const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest');

describe('Eventify Endpoints', function () {
  let db

  const {
    testUsers, 
    testEvents,
    testEventify
  } = helpers.makeEventifyFixtures();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/eventify`, () => {

      it('given no data, it should respond with an empty array and a status 200', () => {
      return supertest(app)
        .get('/api/eventify')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200, [])
      })
    
      beforeEach('insert some eventifies and users', () => {
      return helpers.seedEventifyTables(
        db, testUsers, testEvents, testEventify
        )
      })

    it('should respons to GET `/api/eventify` with an array of eventifies and a status 200', () => {
      return supertest(app)
        .get('/api/eventify')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array')
          res.body.forEach(eventify => {
            expect(eventify).to.be.a('object')
            expect(eventify).to.include.keys('id', 'sender_id', 'recipient_id', 'date_created', 'event', 'is_accept')
          })
        })
      });
    })

    describe('GET /api/eventify/:eventify_id', () => {
      beforeEach('insert some eventifies and users', () => {
        return helpers.seedEventifyTables(
          db, testUsers, testEvents, testEventify
          )
        })
      
      it('should return the correct eventify when given an id', () => {
        let eventify;
        return db('eventify_log')
          .first()
          .then(_eventify => {
            eventify = _eventify
            return supertest(app)
              .get(`/api/eventify/${eventify.id}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
          })
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys('id', 'sender_id', 'recipient_id', 'date_created', 'event', 'is_accept');
            expect(res.body.id).to.equal(eventify.id);
            expect(res.body.sender_id).to.equal(eventify.sender_id)
            expect(res.body.recipient_id).to.equal(eventify.recipient_id)
            // expect(res.body.date_created).to.equal(eventify.date_created)
            expect(res.body.event).to.equal(eventify.event)
            expect(res.body.is_accept).to.equal(eventify.is_accept)
          })
        })

      it('should respond with a 404 when given an invalid id', () => {
        return supertest(app)
          .get('/api/eventify/1000000000')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404);
      })
    })


    describe('POST /api/eventify', () => {
      beforeEach('insert some eventifies and users', () => {
        return helpers.seedEventifyTables(
          db, testUsers, testEvents
          )
      })

      it('should great and return a new event when provided valid data', () => {
        const testEventifys = testEventify[0];
        const testEvent = testEvents[0]
        const testUser = testUsers[0]
        const newEventify = {
          'id': testEventifys.id,
          'sender_id': testUser.id,
          'recipient_id': 2,
          'date_created': '2029-01-22T16:28:32.615Z',
          'event': testEvent.id,
          'is_accept': false,
        }

        return supertest(app)
          .post('/api/eventify')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newEventify)
          .expect(201)
          .expect(res => {
            expect(res.body).to.be.a('array')
            res.body.map(i => 
              expect(i).to.have.all.keys('id', 'sender_id', 'recipient_id', 'date_created', 'event', 'is_accept'))
          })
        })

        it('should respond with a 400 status when given no data', () => {
          const badItem = {  }

          return supertest(app)
            .post('/api/eventify')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(badItem)
            .expect(400)
        })
      })

      describe('PATCH /api/eventify/:eventify_id', () => {
        beforeEach('insert some eventifies and users', () => {
          return helpers.seedEventifyTables(
            db, testUsers, testEvents, testEventify
            )
        })

        it('should update event when given valid data and an id', () => {
          const testEvent = testEvents[0]
          
          const updatedEventify = {
            'recipient_id': 1,
            'event': testEvent.id
          }

          let eventify;
          return db('eventify_log')
            .first()
            .then(_eventify => {
              eventify = _eventify
              return supertest(app)
                .patch(`/api/eventify/${eventify.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updatedEventify)
                .expect(200)
            })
            .then(res => {
              expect(res.body).to.be.a('object')
              expect(res.body).to.include.keys('event', 'recipient_id')
            })
        })

        it('should respond with 400 status when given bad data', () => {
          const badData = {
            badItem: 'brokem item'
          }
          
          return db('eventify_log')
            .first()
            .then(eventify => {
              return supertest(app)
                .patch(`/api/eventify/${eventify.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(badData)
                .expect(400)
            })
        })

        it('should respond with a 404 for an invalid id', () => {
          const eventify = {
            'recipient_id': 2
          }

          return supertest(app)
            .patch(`/api/eventify/100000000`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(eventify)
            .expect(404)
        })
      })


      describe('DELETE /api/eventify/:eventify_id', () => {
        beforeEach('insert some eventifies and users', () => {
          return helpers.seedEventifyTables(
            db, testUsers, testEvents, testEventify
            )
        })

        it('should delete an eventify by id', () => {
          return db('eventify_log')
            .first()
            .then(eventify => {
              return supertest(app)
                .delete(`/api/events/${eventify.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(204)
            })
        })
      })

    })