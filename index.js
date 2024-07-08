const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);




app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté.');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.to(room).emit('message', `User has joined the room: ${room}`);
    });


    socket.on('disconnect', ()=> {
        console.log('Un utilisateur s\'est déconnecté.')
    })


    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
           io.emit('chat message', msg);
    });
    socket.on('message', (msg) => {
        console.log('Message: ' + msg);
           io.emit('message', msg);
    });
});

server.listen(5000, () => {
    console.log('Écoute sur le port 5000...');
});
