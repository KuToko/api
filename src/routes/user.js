const express = require('express');
const middleware = require('../midleware/auth');
const auth = require("../controllers/users/users");

const router = express.Router();

router.get('/', middleware.auth, auth.findAll);
router.get('/:id', middleware.auth, auth.findById);
router.get('/username/:username', middleware.auth, auth.findByUsername);
router.put('/:id', middleware.auth, auth.update);


module.exports = router;
