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
//entiendo que esta es la parte que va en las rutas, mandar x todas las rutas q necesiten db, io? .... pero el io.on connection al hacer login?
io.on('connection', socket => {
  let name
  
  socket.on('connected' , inputName => {
    //socket.on todo lo que pongas aquí va a pasar cuando alguien se conecte en ese evento en concreto ('connected')
    //en front socket.emit('connected', 'huli') sería inicializar una conexión y pasar 'huli' al server
    name = inputName
    socket.broadcast.emit('messages', {name, message: `${name} has entered the chat`})
  })

  socket.on('join', room => {
    console.log(`Socket ${socket.id} with name ${name} joining ${room}`)
    socket.join(room)
  })

/*   socket.on('chat', (message, room) => {
    console.log(`msg: ${message}, room: ${room}`);
    io.to(room).emit('chat', message);
 }); */

  socket.on('message', (name, message) => { //name y message de socket.emit('message', name, message) in Chat.js 15
    io.emit('messages', { name, message })  //volvemos a mandar el mensaje, esta vez a todos los clientes
  })

  socket.on('disconnect', () => {
    io.emit('messages', {server: 'Server', message: `${name} disconnected`})
  })


})

server.listen(process.env.PORT || 3001, () => {
  console.info(`Server with socket opened on ${process.env.PORT} :D`)
})