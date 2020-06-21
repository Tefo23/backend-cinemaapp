const mongoose = require('mongoose')
// const validator = require('validator')

//movieSchema for model 
const movieSchema  = mongoose.Schema({
 
  movieName : {
    type: String,
    required: true,
    trim : true  
  },
  avaiableSeats : {
    type: Number,
    required: true
  },
  timing: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
 
  // all the users id will come there how book the particular movie
  viewers: [{
    viewer:{
      type: String,
      required: true
    }
  }]

  
})

const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie;