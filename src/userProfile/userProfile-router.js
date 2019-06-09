const express = require('express')
const userProfileService = require('./userProfile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();
const path = require('path')

const userProfileRouter = express.Router()

userProfileRouter
  .route('/')
  .get(requireAuth,(req,res,next)=>{
    userProfileService.getAllUserProfiles(
      req.app.get('db')
    )
    .then(profile=>{
      res.json(profile.map(userProfileService.serializeUserProfile))
    })
    .catch(next)
  })

  .post(requireAuth,jsonBodyParser,(req,res,next)=>{
    const {profile_picture,music_like,movie_like,me_intro} = req.body
    const newProfile = {profile_picture,music_like,movie_like,me_intro}
    newProfile.user_id = req.user.id
    for (const [key,value] of Object.entries(newProfile))
      if(value==null)
        return res.status(400).json({
          error:`Missing '${key}' in request body`
        })
        userProfileService.insertUserProfile(
          req.app.get('db')
          ,newProfile
          )
          .then(profile=>{
            res
              .status(201)
              .location(path.posix.join(req.originalUrl,`/${profile.id}`))
              .json(profile)
          })
          .catch(next)
        })

module.exports = userProfileRouter