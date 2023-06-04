const express = require('express')
const upvoteRoutes = require("../../controllers/upvotes.controller");
const midleware = require("../../middleware/auth");

const router = express.Router();

router.get('/', midleware.auth, upvoteRoutes.list); //by user
// router.get("/:id", midleware.auth, upvoteRoutes.detail); // gaperlu
router.post("/", midleware.auth, upvoteRoutes.store); // add
router.delete("/:id", midleware.auth, upvoteRoutes.destroy); // hapus

module.exports = router;
