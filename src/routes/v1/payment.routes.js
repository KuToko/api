const express = require('express');
const middleware = require('../../middleware/auth');
const paymentController = require("../../controllers/payment.controller");

const router = express.Router();

router.post('/', paymentController.store);

module.exports = router;