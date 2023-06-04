const express = require('express')
const upvoteRoutes = require("../../controllers/upvotes.controller");
const midleware = require("../../middleware/auth");

const router = express.Router();

router.get('/', midleware.auth, upvoteRoutes.list);
router.get("/:id", midleware.auth, upvoteRoutes.detail);
router.post("/", midleware.auth, upvoteRoutes.store);
router.delete("/:id", midleware.auth, upvoteRoutes.destroy);

module.exports = router;
