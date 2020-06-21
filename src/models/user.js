const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt  = require("jsonwebtoken")


const userSchema = mongoose.Schema({
 
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  cnic: {
    type: String,
    required: false
    },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Email is invalid!")
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [{
    token:{
      type: String,
      required: true
    }
  }]

})

// Generating the authorization token 
userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, 'cinemaapp')
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

//hashing the password 
userSchema.pre('save', async function(next){
  const user = this
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

//login credentials
userSchema.statics.findByCredentials = async(email, password)=>{
  const user = await User.findOne({email})
  if(!user){
    throw new Error("Email is incorrect!")
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error("Password is incorrect!")
  }

  return user
}


const User = mongoose.model('User', userSchema)
module.exports = User
