const express = require('express');
const router = express.Router();
const productsHandler = require('./handler');
const { isAdmin } = require('../../helpers/jwt');

router.post('/products_varient', isAdmin, productsHandler.createProduct);
router.get('/products_varient/:id', isAdmin, productsHandler.getProductById);
router.put('/products_varient/:id', isAdmin, productsHandler.updateProduct);
router.delete('/products_varient/:id', isAdmin, productsHandler.deleteProduct);
//list
router.get('/products_varient', isAdmin, productsHandler.getAllProducts);

module.exports = router;
