const express = require('express')
const userProfileService = require('./userProfile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();


const userProfileRouter = express.Router()

userProfileRouter
  .route('/')

module.exports = userProfileRouter