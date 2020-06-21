const express = require('express')

//User Model 
const User = require('../models/user')

//Middleware for authentications
const auth = require('../middlewares/userAuth')
const fs = require('fs')

const router  = new express.Router()


// user signup api
router.post('/user', async(req, res)=>{
  let user
  if(req.file){
    user = new User({
      ...req.body,
    })
  }else{
    user = new User({
      ...req.body 
    })
  }
 
  try{
    await user.save()
    const token = await user.generateAuthToken()
    // console.log(token)
    res.status(200).send({user, token})
  }catch(e){
    res.status(400).send(e)
  }
}, (error, req, res, next)=>{
  res.status(400).send({error: error.message})
} 
)

// user login api
router.post('/user/login', async(req, res)=>{
  try{
    console.log(req.body.email)
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({user, token})
  }catch(e){
    res.status(400).send(e)
  }
})

// user logout api
router.post('/user/logout', auth, async(req, res)=>{
  try{
    req.user.tokens = []
    await req.user.save()
    res.status(200).send({msg:"Logout Successfully"})
  }catch(e){  
    res.status(501).send(e)
  }
})

// user edit api
router.patch('/user/edit', auth, async(req,res)=>{
  if(req.file){
    req.body = {
      ...req.body,
    }
  }else{
    req.body = req.body
  }
  const updates = Object.keys(req.body)
  const allowedUpdates = ["username", "email", "password"]
  const isValid = updates.every((update) => allowedUpdates.includes(update))
  if(!isValid){
    res.status(400).send("User trying invalid Updates!")
  }
  try{
     const user = req.user
     updates.forEach((update)=>{
       user[update] = req.body[update]
     })
     if(!user){
       res.status(400).send()
     }
     await user.save()
     res.status(200).send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

module.exports = router