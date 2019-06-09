const express = require('express')
const userProfileService = require('./userProfile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();


const userProfileRouter = express.Router()

userProfileRouter
  .route('/')
  .get((req,res,next)=>{
    userProfileService.getAllUserProfiles(
      req.app.get('db')
    )
    .then(profile=>{
      res.json(profile.map(userProfileService.serializeUserProfile))
    })
    .catch(next)
  })

module.exports = userProfileRouter