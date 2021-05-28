const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    date: {
        type: String,
        default: new Date().toDateString()
    }
});

module.exports = mongoose.model('ChatUsers', userSchema);