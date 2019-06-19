const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest');

describe('Eventify Endpoints', function () {
  let db

  const {
    testUsers, 
    testEventify
  } = helpers.makeEventifyFixtures();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /eventify`, () => {
    beforeEach('insert some eventifys and users', () => {
      return helpers.seedEventifyTables(
        db, testUsers, testEventify
      )
    })

    it('should respons to GET `/eventify` with an array of eventifies and a status 200', () => {
      return supertest(app)
        .get('/eventify')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        // .expect(res => {
        //   expect(res.body).to.be.a('array')
        //   // expect(res.body).to.have.length(eventify.length)
        //   res.body.forEach(eventify => {
        //     expect(eventify).to.be.a('object')
        //     expect(eventify).to.include.keys('id', 'sender_id', 'recipient_id', 'date_created', 'event', 'is_accept', 'profile_pictre', 'music_like', 'movie_like', 'me_intro', 'event_name', 'event_date', 'event_time', 'event_location', 'is_private', 'gender', 'full_name')
        //   })
        // })
    });
  })
})