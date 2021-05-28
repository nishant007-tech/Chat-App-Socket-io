const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

//for socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', authRoutes);

mongoose.connect('mongodb+srv://nishant007-tech:nishanti69@cluster0.jmjrn.mongodb.net/nishant?retryWrites=true&w=majority', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('We Are Connected to DB');
});
let users = [];
const addUser = (userId, username, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, username, socketId });
}
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("adduser", (userId, username) => {
        addUser(userId, username, socket.id);
        io.emit("getusers", users);
    })
    socket.on('privatemsg', (message) => {
        try {
            const onlineFriend = getUser(message.receiver);
            io.to(onlineFriend.socketId).emit('privatemessage', message); // for receiver 
        } catch (error) {
            console.log("Error in Private Message:", error)
        }
    });


    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getusers", users);
    });
    socket.on("disconnectUser", (userId) => {
        try {
            console.log("user disconnected");
            let filterUsers = users.filter((user) => user.userId !== userId);
            users = filterUsers;
            socket.broadcast.emit('getusers', users);
        } catch (err) {
            console.log(err);
        }
    })
})

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
    })
}


const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});