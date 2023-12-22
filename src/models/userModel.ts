import mongoose, { Schema } from 'mongoose';

const roles = ['patient','staff', 'admin'];

const userSchema = new Schema({
    first_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    last_name: { type: String, required: true, minlength: 3, maxlength: 30 },
    username: { type: String, required: true, minlength: 4, maxlength: 200, unique: true },
    email: { type: String, required: true, minlength: 10, maxlength: 200, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 200 },
    role: { type: String, required: true, enum: roles, default: 'patient' },
    contact: { type: String, minlength: 10, maxlength: 12 },
    address: { type: String, minlength: 3, maxlength: 200 },
    location: {
        city: { type: String },
        province: { type: String },
    },
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;