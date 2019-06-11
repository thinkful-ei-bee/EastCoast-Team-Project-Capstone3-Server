const knex = require('knex')
const app = require('../src/app');

describe('Events API:', function () {
  let db;
  let events = [
    { "name": "Coachella",   "location": "California", 'date': "April 21 2019"},
    { "name": "Wine tasting",  "location": 'Maryland', 'date': "June 8 2019"},
    { "name": "Cherry Blossom Festival", "location": 'Washington, DC', 'date': "April 1st 2019"},
  ]

  
})