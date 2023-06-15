const express = require('express');
const middleware = require('../../middleware/auth');
const paymentCallbackController = require("../../controllers/paymentcallback.controller");

const router = express.Router();

router.post('/', paymentCallbackController.callback);

module.exports = router;