const express = require('express')
require('./src/db/mongoose')
const cors = require('cors')
//bodyparser 
const bodyParser = require('body-parser')

//requiring the routers
const UserRouter = require('./src/routers/User')
const MovieRouter = require('./src/routers/Movie')

const app =express()

//address
const port = process.env.PORT || 5000

//cors
app.use(cors());
app.options('*', cors());

//request body parsing 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Routers 
app.use(UserRouter)
app.use(MovieRouter)
app.use('/images', express.static('images'))

app.listen(port, ()=>{
  console.log(`Server is running on ${port}`)
})