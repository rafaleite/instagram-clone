require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()
const server = app.listen(3333)
const io = require('socket.io')(server)

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(cors());

app.use('/files', express.static( path.resolve(__dirname, '..', 'uploads', 'resized') ))
app.use(require('./route'))

