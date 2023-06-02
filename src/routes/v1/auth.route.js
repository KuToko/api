const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();

const loginController = require('../../controllers/auth/login.controller');
const registerController = require('../../controllers/auth/register.controller');
const logoutController = require('../../controllers/auth/logout.controller');

router.post('/register',registerController.userRegister);
router.post('/login', loginController.userLogin);
router.get('/logout', middleware.auth, logoutController.logout);

module.exports = router;
