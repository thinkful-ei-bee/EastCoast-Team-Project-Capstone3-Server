const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('UserProfile Endpoints', function () {
  let db

  const {
    testUsers,
    testProfiles
  } = helpers.makeProfileFixtures();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /user_profile/current-user`, () => {
    beforeEach('insert user_profile', () => {
      return helpers.seedUserProfiles(
        db,
        testUsers,
        testProfiles
      )
    })
    it('should respond to GET `/current-user` with an array of profiles and a status 200', () => {
      return supertest(app)
        .get('/api/user_profile/current-user')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array')
          res.body.forEach(profile => {
            expect(profile).to.be.a('object')
            expect(profile).to.include.keys('id', 'profile_picture', 'music_like', 'movie_like', 'me_intro', 'user_id')
          })
        })
    }) 
})

describe()

})