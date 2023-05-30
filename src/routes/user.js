const express = require('express');
const middleware = require('../midleware/auth');
const auth = require("../controllers/users");

const router = express.Router();

router.get('/', middleware.auth, auth.findAll);

module.exports = router;
