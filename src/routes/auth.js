const express = require('express');
const loginController = require('../controllers/Auth/loginController');
const userController = require('../controllers/Auth/registerController');
const router = express.Router();

router.post('/register',userController.userRegister);
router.post('/login', loginController.userLogin);

module.exports = router;
