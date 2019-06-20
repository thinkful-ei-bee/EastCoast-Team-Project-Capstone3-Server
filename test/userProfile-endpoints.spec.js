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

  describe(`GET /api/current-user`, () => {
    beforeEach('insert user_profile', () => {
      return helpers.seedUserProfiles(
        db,
        testUsers,
        testProfiles
      )
    })
    it('should respond to GET `/current-user` with an array of profiles and a status 200', () => {
      return supertest(app)
        .get('/api/current-user')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array')
          res.body.forEach(profile => {
            expect(profile).to.be.a('object')
            expect(profile).to.include.keys('id', 'profile_picture', 'music_like', 'movie_like', 'me_intro')
          })
        })
    }) 
})

  // describe('PATCH /api/user_profile/:user_id', () => {
  //   this.beforeEach('insert some users and profiles', () => {
  //     return helpers.seedUserProfiles(
  //       db,
  //       testUsers,
  //       testProfiles
  //     )
  //   })
  //   it('should update profile when given valid data and an id', () => {
  //     const updatedProfile = {
  //       'id': 1,
  //       'profile_picture': 'https://reason.org/wp-content/uploads/2018/01/guybentley.jpg',
  //       'music_like': 'test-music-1',
  //       'movie_like': 'test-music-2',
  //       'me_intro': 'test-bio-1',
  //       'user_id': 1
  //     }
  //     let profile;
  //     return db('user_profile')
  //       .first()
  //       .then(_profile => {
  //         profile = _profile
  //         return supertest(app)
  //           .patch(`/api/user_profile/${profile.id}`)
  //           .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
  //           .send(updatedProfile)
  //           .expect(200)
  //       })
  //       .then(res => {
  //         expect(res.body).to.be.a('object')
  //         expect(res.body).to.include.keys('id', 'profile_picture', 'music_like', 'movie_like', 'me_intro', 'user_id')
  //       })
  //   })
  //   it('should respond with a 404 for an invalid id', () => {
  //     const profile = {
  //       'id': 1
  //     }
  //     return supertest(app)
  //       .patch(`/api/user_profile/abcd`)
  //       .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
  //       .send(profile)
  //       .expect(404)
  //   })
  // })

  describe('DELETE /api/user_profile/:user_id', () => {
    this.beforeEach('insert some users and profiles', () => {
      return helpers.seedUserProfiles(
        db,
        testUsers,
        testProfiles
      )
    })
    it('should delete a profile by id', () => {
      return db('user_profile')
        .first()
        .then(profile => {
          return supertest(app)
            .delete(`/api/user_profile/${profile.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(204)
        })
    })
  })

})