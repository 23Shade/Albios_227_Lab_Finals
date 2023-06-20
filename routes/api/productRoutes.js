const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/active', productController.getActiveProducts);
router.get('/:productId', productController.getSingleProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.archiveProduct);

module.exports = router;
