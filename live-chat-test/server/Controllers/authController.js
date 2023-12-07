const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
    const jwtkey = process.env.SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: '5min' });
};

const registerUser = async (req, res) => {
    try {
    const { firstname, lastname, username, email, password, confirmpassword } = req.body;
    
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({ message: 'Username already registered' });
    }

    if (!firstname || !lastname || !username || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password must be a strong password' });
    }

    if (!validator.equals(password, confirmpassword)) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const newUser = new userModel({ firstname, username, lastname, email, password });
    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);


    await newUser.save();

    const token = createToken(newUser._id);
    res.status(200).json({
        _id: newUser._id,
        firstname,
        lastname,
        username,
        email,
        token,
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
};


const loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        const isEmail = validateEmail(emailOrUsername);

        let user;

        if (isEmail) {
            user = await userModel.findOne({ email: emailOrUsername });
        } else {
            user = await userModel.findOne({ username: emailOrUsername });
        }

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(404).json({ message: 'Invalid email or username or password' });
        }

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, username: user.username, email: user.email, firstname: user.firstname, token });
    } catch (err) {
        res.status(500).json({ err });
    }

    function validateEmail(input) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input);
    }
};

module.exports = { registerUser, loginUser };

