const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors    = require("cors");
const dotenv  = require("dotenv");
dotenv.config();
const databaseConnect = require("./utils/databaseConnect");
const authRouter = require("./routers/authRouter");
const authMiddleware = require("./middlewares/authMiddleware");


const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
    console.log(`Request to the path:"${req.path}" using method:${req.method} at:${new Date().toUTCString()}`);
    next();
});


app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.use("/auth", authRouter);

app.use(authMiddleware);

//! test
app.get("/info/me", function (req, res) {
    res.json(`id:${req.user._id}, pseudo:${req.user.pseudo}`);
});
//!

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


// server.listen(5000, () => {
//     console.log('Écoute sur le port 5000...');
// });
const PORT = 5000;
const dbName = "ChatApp";

async function start() {
    try {
        await databaseConnect(process.env.DATABASE_URL, dbName, `Connect to the DB:${dbName}`);
        
        app.listen(PORT, function () {
            console.log(`My server started at port:${PORT}`);
        });
    } catch (error) {
        console.error(`Error, server can't start:${error}`);
    }
}

start();