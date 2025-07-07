const express = require('express');
const authRouter =express.Router();

const { userRegister, userLogin } = require('../controller/authController');

// Routes
authRouter.post ('/register', userRegister);
authRouter.post('/login',userLogin);

module.exports = authRouter;