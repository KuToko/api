const express = require('express')
const orderControllers = require("../../controllers/orders.controller");
const midleware = require("../../middleware/auth");

const router = express.Router();

router.post('/', midleware.auth, orderControllers.store);
router.get('/list', midleware.auth, orderControllers.list);
router.get('/:id', midleware.auth, orderControllers.detail);
module.exports = router;
