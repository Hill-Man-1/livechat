const express = require('express');
const { findUser, getUsers } = require('../Controllers/userController');

const router = express.Router();


router.get('/all', getUsers);

router.get('/:userId', findUser);

module.exports = router;
