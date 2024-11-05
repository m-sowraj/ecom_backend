const express = require('express');
const router = express.Router();
const productsHandler = require('./handler');
const { isAdmin } = require('../../helpers/jwt');

router.post('/products', isAdmin, productsHandler.createProduct);
router.get('/products/:id', isAdmin, productsHandler.getProductById);
router.put('/products/:id', isAdmin, productsHandler.updateProduct);
router.delete('/products/:id', isAdmin, productsHandler.deleteProduct);
//list
router.get('/products', isAdmin, productsHandler.getAllProducts);

module.exports = router;
