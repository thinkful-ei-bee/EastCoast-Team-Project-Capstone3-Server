const express = require('express')
const UsersService = require('../users/users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

const path = require('path')
usersRouter
  .get('/',(req,res,next)=>{
    
  })
usersRouter
  .post('/', jsonBodyParser, (req, res,next) => {
    
    const { password, user_name, full_name, gender,email } = req.body
    console.log(password, user_name, full_name, gender,email)
    for(const field of ['full_name', 'user_name', 'password','gender','email'])
      if(!req.body[field])
        return res.status(400).json(
          {
            error: `Missing '${field}' in request body`
          }
        )
        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
        return res.status(400).json({ error: passwordError })
        
          
        UsersService.hasUserWithUserName(
          req.app.get('db')
          ,user_name
        )
        .then(hasUserWithUserName=>{
          if(hasUserWithUserName)
            return res.status(400).json({error: `Username already taken`})
        //     res.status(201)
        // .location(path.posix.join(req.originalUrl, `/whatever`))
        // .json({
        //   id: 'whatever',
        //   user_name,
        //   full_name,
        //   nickname: nickname || '',
        //   date_created: Date.now(),
        // })
        return UsersService.hashPassword(password)
          .then(hashedPassword=>{
            const newUser = {
              user_name,
              password:hashedPassword,
              full_name,
              email,
              gender,
              date_created:'now()'
          
          }
          
          return UsersService.insertUser(
            req.app.get('db'),
            newUser
          )
          .then(user=>{
            res 
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user))
          })
        })
        })
        .catch(next)

  })

module.exports = usersRouter