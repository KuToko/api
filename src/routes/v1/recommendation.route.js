const express = require('express');
const middleware = require('../../middleware/auth');
const recommendationController = require("../../controllers/recommendation.controller");
const router = express.Router();

router.get('/' , middleware.auth, recommendationController.recommendationByUser);
router.get('/similar/:id_business' , middleware.auth, recommendationController.recommendationByBusiness);

module.exports = router;