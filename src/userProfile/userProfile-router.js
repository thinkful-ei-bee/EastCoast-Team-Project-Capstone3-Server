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
userProfileRouter
  .route('/:profile_id')
  .all(requireAuth)
  .all((req,res,next)=>{
    userProfileService.getById(
      req.app.get('db'),
      req.params.profile_id
    )
    .then(profile=>{
      if(!profile){
        return res.status(404).json(
          {error:{message:`profile doesn't exist`}}
        )
      }
      res.profile = profile
      next()
      return profile
    })
    .catch(next)
  })
  .get(requireAuth)
  .get((req,res,next)=>{
    res.json(userProfileService.serializeUserProfile(res.profile))
  })
  .delete(requireAuth,(req,res,next)=>{
    userProfileService.deleteUserProfile(
      req.app.get('db'),
      req.params.profile_id
    )
    .then(numRowAffected=>{
      res.status(204).end()
    })
    .catch(next)
  })

  .patch(requireAuth,jsonBodyParser,(req,res,next)=>{
    const {profile_picture,music_like,movie_like,me_intro} = req.body
    const profileToUpdate = {profile_picture,music_like,movie_like,me_intro}
    userProfileService.updateUserProfile(
      req.app.get('db'),
      req.params.profile_id,
      profileToUpdate
    )
    .then(numRowAffected=>{
      res.status(204).end()
    })
    .catch(next)
  })

module.exports = userProfileRouter