const express = require('express');
const middleware = require('../midleware/auth');
const users = require("../controllers/users");
const loginController = require('../controllers/Auth/loginController');
const userController = require('../controllers/Auth/registerController');
const router = express.Router();

router.get('/get',middleware.auth, users.findAll);
router.post('/register',userController.userRegister);
router.post('/login', loginController.userLogin);
// // router.put('/:id',userController.updateUser);
// router.delete('/:id',userController.deleteUser);

module.exports = router;
