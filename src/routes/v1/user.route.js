const express = require('express');
const middleware = require('../../middleware/auth');
const auth = require("../../controllers/user.controller");

const router = express.Router();

router.get('/', middleware.auth, auth.findAll);

module.exports = router;
