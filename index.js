require("dotenv").config();
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => {

  socket.on('connected' , () => {
    console.log('user connected')
  })

  socket.on('message', (name, message) => {
    io.emit('messages', {name, message})
  })
})

server.listen(process.env.PORT || 3001, () => {
  console.info(`Server with socket opened on ${process.env.PORT} :D`)
})