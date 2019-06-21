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

function makeProfileArray(users) {
  return [
    {
      id: 1,
      user_id: 1,
      profile_picture: 'https://reason.org/wp-content/uploads/2018/01/guybentley.jpg',
      music_like: 'test movie 1',
      movie_like: 'test music 1',
      me_intro: 'test bio 1'
    },
    {
      
      id: 2,
      user_id: 2,
      profile_picture: 'https://assets.capitalfm.com/2018/23/lilliya-scarlett-instagram-1528814125-custom-0.png',
      music_like: 'test music 2',
      movie_like: 'test movie 2',
      me_intro: 'test bio 2'
    
    }
  ]
}

function makeEventsArray(users) {
  return [
    {
      id: 1,
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
      id: 2,
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

function makeEventifyArray() {
  return [
    {
      id: 1,
      sender_id: 1,
      recipient_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      event: 1,
      is_accept: false
    },
    {
      id: 2,
      sender_id: 2,
      recipient_id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
      event: 2,
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
  const testEvents = makeEventsArray()
  const testEventify = makeEventifyArray()
  return { testUsers, testEvents, testEventify }
}

function makeProfileFixtures() {
  const testUsers = makeUsersArray()
  const testProfiles = makeProfileArray(testUsers)
  return {testUsers, testProfiles}
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

function seedEventifyTables(db, users, events, eventify) {
  return seedUsers(db, users)
    .then(() => db.into('events').insert(events))
    .then(() => db.into('eventify_log').insert(eventify))

}

function seedUserProfiles(db, users, profile) {
  return seedUsers(db, users)
    .then(() => db.into('user_profile').insert(profile))
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
  seedUsers,

  makeProfileFixtures,
  makeProfileArray,
  seedUserProfiles,

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