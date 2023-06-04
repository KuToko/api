const express = require('express');
const authRoute = require('./auth.route');
const businessRoute = require('./business.route');
const feedbackRoute = require('./feedback.route');
const userRoute = require('./profile.routes');
const upvoteRoute = require('./upvote.routes');
const config = require('../../config/config');
const helper = require('../../helpers/helpers');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/businesses', businessRoute);
router.use('/feedbacks', feedbackRoute);
router.use('/profile', userRoute);
router.use('/votes',upvoteRoute);

module.exports = router;
