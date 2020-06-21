const jwt = require('jsonwebtoken')
const User = require('../models/user')

//authentication of the user .
const auth = async (req, res, next) => {
  try{
    //fetch token from header
    const token = req.header('Authorization')
    const decoded = jwt.verify(token, 'cinemaapp')
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user){
      throw new Error()
    } 

    //responding token and user in request.
    req.token = token
    req.user = user
    next()
  }catch(e){
    res.status(401).send({error: 'Please Authenticate'})
  }
}


module.exports = auth