const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('User Endpoints', function(){
    let db
    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db'. db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        this.beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

        const requiredFields = ['email', 'gender', 'full_name', 'password']
        requiredFields.forEach(field => {
            const registerAttemptBody = {
                email: 'test email',
                gender: 'test gender',
                full_name: 'test full_name',
                password: 'test password',
                user_name: 'test user_name'
            }
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete registerAttemptBody[field]
              
              return supertest(app)
                .post('/api/users')
                .send(registerAttemptBody)
                .expect(400, {
                    error: `Missing '${field}' in request body`,
                })
            })
        })
        it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
            const shortPassword = {
                user_name: 'test user_name',
                password: '12345'
            }
            return supertest(app)
                .post('/api/users')
                .send(shortPassword)
                .expect(400, {error: `Password be longer than 8 characters`})
        })
        it(`responds 400 'Password be less than 72 characters' when long password`, () => {
            const longPassword = {
                user_name: 'test user_name',
                password: '*'.repeat(73)
            }
            return supertest(app)
                .post('api/users')
                .send(longPassword)
                .expect(400, {error: `Password be less than 72 characters`})
        })
        it(`responds 400 error when password starts with spaces`, () => {
            const passwordStartsWithSpaces = {
                user_name: 'test user_name',
                password: ' 12345'
            }
            return supertest(app)
                .post('api/users')
                .send(passwordStartsWithSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })
        it(`responds 400 error when password ends with spaces`, () => {
            const passwordEndsWithSpaces = {
                user_name: 'test user_name',
                password: '12345 '
            }
            return supertest(app)
                .post('api/users')
                .send(passwordEndsWithSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })
        it(`responds 400 error when password isn't complex enough`, () => {
            const passwordNotComplex = {
                user_name: 'test user_name',
                password: '1122334455'
            }
            return supertest(app)
                .post('/api/users')
                .send(passwordNotComplex)
                .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
        })
        it(`responds 400 'Username already taken' when username isn't unique`, () => {
            const duplicateUsername = {
                user_name: testUser.user_name,
                password: '11AAaa!!'
            }
            return supertest(app)
                .post('/api/users')
                .send(duplicateUsername)
                .expect(400, { error: `Username already taken` })
        })
        describe(`Given a valid user`, () => {
            it(`responds 201, serialized user with no password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAaa!!'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
            })
            it(`stores the new user in db with bcryped password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAaa!!'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(res =>
                        db
                            .from('user')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})