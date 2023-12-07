const mongoose = require('mongoose');

const roles = ['doctor', 'patient', 'admin', 'assistant'];

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, minlength: 3, maxlength: 30 },
    lastname: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 10, maxlength: 200, unique: true },
    username: { type: String, required: true, minlength: 4, maxlength: 200, unique: true },
    role: { type: String, required: true, enum: roles, default: 'patient' },
    password: { type: String, required: true, minlength: 8, maxlength: 200 }
}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
