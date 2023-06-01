const express = require('express');
const middleware = require('../midleware/auth');
const businessController = require("../controllers/business/businessController");
const router = express.Router();

router.get('/',middleware.auth, businessController.findStore);
// // router.put('/:id',userController.updateUser);
// router.delete('/:id',userController.deleteUser);

module.exports = router;