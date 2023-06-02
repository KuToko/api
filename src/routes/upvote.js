const express = require('express')
const upvoteController = require("../controllers/upvotes/upvotes");
const midleware = require("../midleware/auth");

const router = express.Router();

router.get('/', midleware.auth, upvoteController.findAll);
// router.get("/:id", midleware.auth, upvoteController.findByUserId);
router.post("/:id", midleware.auth, upvoteController.createVote);
router.delete("/:id", midleware.auth, upvoteController.deleteVote);

module.exports = router;
