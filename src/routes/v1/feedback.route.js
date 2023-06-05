const express = require('express');
const middleware = require('../../middleware/auth');
const feedbackController = require("../../controllers/feedback.controller");
const router = express.Router();

router.get('/',middleware.auth, feedbackController.list);
router.post('/',middleware.auth, feedbackController.store);
// router.get('/:id',middleware.auth, feedbackController.detail);
// router.patch('/:id',middleware.auth, feedbackController.update);
// router.delete('/:id',middleware.auth, feedbackController.delete);

module.exports = router;