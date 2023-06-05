const express = require('express');
const middleware = require('../../middleware/auth');
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get('/',middleware.auth, productController.list);
router.get('/:id',middleware.auth, productController.detail);
router.post('/',middleware.auth, productController.store);
router.patch('/:id',middleware.auth, productController.update);
router.delete('/:id',middleware.auth, productController.destroy);

module.exports = router;