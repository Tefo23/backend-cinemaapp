const express = require('express')
const auth = require('../middlewares/userAuth')
const multer = require('multer')
const Movie = require('../models/movie');

//router express
const router = express.Router()

//multer is using for the image storage.
var storage =  multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'images')
  },
  filename: (req, file, cb)=>{
    cb(null, file.fieldname + '-'+Date.now()+ '.jpg')
  }
});
var upload = multer({

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  },
  storage: storage,
  
});

// Add the movie details.
// to show on the cards.
router.post('/movie',  upload.single('image'), auth, async(req, res)=>{
  let movie
  if(req.file){
      movie = new Movie({
      ...req.body,
      image: req.file.path
        })
  }else{
      movie = new Movie({
      ...req.body,
    
    })
  }
  try{
    await movie.save()
    res.status(200).send({msg : 'Successfully Added!', movie})
  }catch(e){
    res.status(400).send(e.message)
  }
})

// get movies.
// Fetch all the movies, added by the admin
router.get('/movie', async(req, res)=>{
  try{
    const movies = await Movie.find()
    res.status(200).send(movies)
  }catch(e){
    res.status(400).send(e)
  }
})


//Delete route for movie.
//Admin can delete the movie.
router.delete('/movie/del/:id', auth, async(req, res)=>{
  try{
    await Movie.findByIdAndDelete(req.params.id)
    res.status(200).send({msg : 'Successfully Deleted!'})
  }catch(e){
    res.status(400).send(e)
  }
})


//Modify the movie details by its object id
router.patch('/movie/edit/:id', async(req, res)=>{

  const updates = Object.keys(req.body)
  const allowedUpdates = ['movieName', 'avaiableSeats', 'timing']

  //shows an error when there is invalid updates.
  const isValidOperation = updates.every((update)=> allowedUpdates.includes(update) )
  if(!isValidOperation){
   res.send(404).send({error: 'Invalid updates'})
  }

  try{
    
    const movie =await Movie.findByIdAndUpdate({_id: req.params.id}, req.body)
    res.status(200).send({movie , msg : 'Successfully Modified!'})

  }catch(e){
    res.status(400).send(e.message)
  }

})


//Book the Movie
//user ID will go to Movie model
router.post('/movie/book/:id',auth, async(req, res)=>{
  try{
    const movie = await Movie.findById(req.params.id)
    const viewer = req.user._id
    movie.viewers = movie.viewers.concat({viewer}) 
    movie.avaiableSeats = movie.avaiableSeats-1
    await movie.save()
    res.status(200).send(movie)
  }catch(e){
    res.status(400).send(e)
  }
})

//UnBook the Movie
//user ID will remove from the Movie model
router.post('/movie/unbook/:id',auth, async(req, res)=>{
  try{
    const movie = await Movie.findById(req.params.id)
    const Mviewer = req.user._id

    movie.viewers = movie.viewers.filter( v=> {
        if(Mviewer !== v.viewer){
          // console.log(v.viewer)
          return v 
        }
    });

    await movie.save()
    res.status(200).send(movie)
  }catch(e){
    res.status(400).send(e)
  }
})



module.exports = router;