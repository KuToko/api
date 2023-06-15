const express = require('express');
const middleware = require('../../middleware/auth');
const businessController = require("../../controllers/business.controller");
const router = express.Router();

router.get('/', middleware.auth, businessController.list);
router.get('/search', middleware.auth, businessController.search);
router.get('/:id', middleware.auth, businessController.detail);
router.get('/my/business', middleware.auth, businessController.mine);

module.exports = router;