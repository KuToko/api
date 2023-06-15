const express = require('express');
const authRoute = require('./auth.route');
const businessRoute = require('./business.route');
const feedbackRoute = require('./feedback.route');
const userRoute = require('./profile.routes');
const upvoteRoute = require('./upvote.routes');
const productRoute = require('./product.routes');
const orderRoute = require('./order.routes')
const recommendationRoute = require('./recommendation.route');
const paymentCallbackRoute = require('./paymentcallback.routes');
const paymentRoute = require('./payment.routes');
const config = require('../../config/config');
const helper = require('../../helpers/helpers');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/businesses', businessRoute);
router.use('/feedbacks', feedbackRoute);
router.use('/profile', userRoute);
router.use('/votes',upvoteRoute);
router.use('/products',productRoute);
router.use('/recommendation',recommendationRoute);
router.use('/callback', paymentCallbackRoute);
router.use('/orders', orderRoute);
router.use('/payments', paymentRoute);

module.exports = router;
