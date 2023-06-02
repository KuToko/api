const express = require('express');
const authRoute = require('./auth.route');
const businessRoute = require('./business.route');
const feedbackRoute = require('./feedback.route');
const userRoute = require('./user.route');
const config = require('../../config/config');
const helper = require('../../helpers/helpers');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/businesses', businessRoute);
router.use('/feedbacks', feedbackRoute);
router.use('/users', userRoute);

module.exports = router;