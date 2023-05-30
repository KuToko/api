const express = require('express');
const registerController = require('../controllers/auth/registerController');
const loginController = require('../controllers/auth/loginController');
const logoutController = require('../controllers/auth/logoutController');
const middleware = require('../midleware/auth');
const router = express.Router();

router.post('/register',registerController.userRegister);
router.post('/login', loginController.userLogin);
router.get('/logout', middleware.auth, logoutController.logout);

module.exports = router;
