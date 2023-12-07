const express = require('express');
const { findUser, getUsers } = require('../Controllers/userController');

const router = express.Router();

router.get('/:userId', findUser);
router.get('/all', getUsers);

module.exports = router