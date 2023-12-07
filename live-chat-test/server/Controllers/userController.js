const userModel = require('../Models/userModel')

const findUser = async (req,res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId)

        res.status(200).json({user})
    } catch (err) {
        console.log(err);
        res.status(500).json({err})
    }
}

const getUsers = async (req,res) => {
    try {
        const users = await userModel.find()

        res.status(200).json({users})
    } catch (err) {
        console.log(err);
        res.status(500).json({err})
    }
}

module.exports = { findUser, getUsers };