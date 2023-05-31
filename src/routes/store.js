const express = require('express');
const middleware = require('../midleware/auth');
const StoreController = require("../controllers/store/storeController");
const router = express.Router();

router.get('/:id',middleware.auth, StoreController.findStore);
// // router.put('/:id',userController.updateUser);
// router.delete('/:id',userController.deleteUser);

module.exports = router;