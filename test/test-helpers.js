const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      email:'test@gmail.com',
      password: 'password',
      gender:'male'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      email:'test2@gmail.com',
      password: 'password',
      gender:'female'
    },
  ]
}

function makeEventsArray(users) {
  return [
    {
      event_name: 'test-event-1',
      event_date: '2020-03-12',
      event_time: '12:00pm,',
      event_details: 'test event details 1',
      event_location: 'California',
      event_owner_id: 1, 
      is_private: false, 
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      event_name: 'test-event-2',
      event_date: '2020-03-12',
      event_time: '1:00pm,',
      event_details: 'test event details 2',
      event_location: 'California',
      event_owner_id: 2,
      is_private: false, 
      date_created: '2029-01-22T16:28:32.615Z'
    }
  ]
}

function makeEventifyArray(users) {
  return [
    {
      sender_id: 1,
      recipient_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      event: 15,
      is_accept: false
    },
    {
      sender_id: 2,
      recipient_id: 5,
      date_created: '2029-01-22T16:28:32.615Z',
      event: 25,
      is_accept: false
    }
  ]
}

function makeEventsFixtures() {
  const testUsers = makeUsersArray()
  const testEvents = makeEventsArray(testUsers)
  return { testUsers, testEvents }
}

function makeEventifyFixtures() {
  const testUsers = makeUsersArray()
  const testEventify = makeEventifyArray(testUsers)
  return { testUsers, testEventify }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        eventify_log,
        events,
        users,        
        intrigued_log,
        user_profile
        RESTART IDENTITY CASCADE`
    )
    )
  }

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
 }

function seedEventsTables(db, users, events) {
  return seedUsers(db, users)
    .then(() => db.into('events').insert(events))
}

function seedEventifyTables(db, users, eventify) {
  return seedUsers(db, users)
    .then(() => db.into('eventify_log').insert(eventify))
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
         subject: user.user_name,
         algorithm: 'HS256',
     })
   return `Bearer ${token}`
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,

  makeEventsArray,
  seedUsers,
  seedEventsTables,
  makeEventsFixtures,

  makeEventifyArray,
  seedEventifyTables,
  makeEventifyFixtures,

  cleanTables,
  makeAuthHeader,
}