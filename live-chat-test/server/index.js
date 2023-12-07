const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');

const app = express();

require('dotenv').config();

app.use(express.json())
app.use(cors());

const port = process.env.PORT;
const uri = process.env.MONGO_URI;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB connection established");
    }).catch((error) => {
        console.log("Error connecting to MongoDB", error.message);
    });
    
app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
});
    
app.get('/', (req, res) => {
    res.send("this is an app chat")
})

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use('/messages', messageRoute);