const express = require('express')
const authRouter = express.Router()
const AuthService = require('./auth-service')
const jsonBodyParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

authRouter
  .route('/login')
  .post(jsonBodyParser, async (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    try {
      const dbUser = await AuthService.getUserWithUserName(
        req.app.get('db'),
        loginUser.user_name
      )

      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect username or password',
        })

      const compareMatch = await AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      )

      if (!compareMatch)
        return res.status(400).json({
          error: 'Incorrect username or password',
        })

      const sub = dbUser.user_name
      const payload = {
        user_id: dbUser.id,
        name: dbUser.name,
      }
      res.send({
        authToken: AuthService.createJwt(sub, payload),
      })
    } catch (error) {
      next(error)
    }
  })
  .put(requireAuth, (req, res) => {
    const sub = req.user.user_name
    const payload = {
      user_id: req.user.id,
      name: req.user.name,
    }
    res.send({
      authToken: AuthService.createJwt(sub, payload),
    })
  })
  module.exports = authRouter