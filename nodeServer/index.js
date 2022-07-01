// Node server which will handle socket to connections
const express = require('express');
const socket = require('socket.io')
const cors = require('cors')
const app = express();
const PORT = 8000;
var users = [];
app.use(express.json());
app.use(cors());
const server = app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
const io = socket(server,{cors:{
    origin : "*",
    methods : ["GET","POST"]
}})
io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        // console.log("New user", name);
        // console.log(socket.id);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
})
