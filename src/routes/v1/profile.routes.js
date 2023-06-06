const express = require('express');
const middleware = require('../../middleware/auth');
const profileController = require("../../controllers/profile.controller");

const router = express.Router();
router.get('/', middleware.auth, profileController.detail);
router.put('/', middleware.auth, profileController.update);


module.exports = router;
