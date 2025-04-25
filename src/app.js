require("dotenv").config({
    path: `${__dirname}/../.env`
});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(bodyParser.json());

const { authRoute } = require("./routes/auth/auth.route");
const { movieRouter } = require("./routes/movie/movie.route");


app.use('/api/auth', authRoute);
app.use('/api/movies', movieRouter);
// app.use('/api/admin', require('./routes/admin'));

// Socket.IO
io.on('connection', socket => {
    console.log('User connected');

    socket.on('newRating', movieId => {
        io.emit('ratingUpdated', movieId);
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

const APP_PORT = process.env.APP_PORT;
server.listen(APP_PORT, () => {
    console.log(`The app is listening at http://localhost:${APP_PORT}`);
});

