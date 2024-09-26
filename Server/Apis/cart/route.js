const express = require('express');
const router = express.Router();
const cartHandler = require('./handler'); // Adjust path as needed

router.post('/carts', cartHandler.createCart);
router.get('/carts/:userId', cartHandler.getCartByUserId);
router.post('/carts/:userId/items', cartHandler.addItemToCart);
router.put('/carts/:userId', cartHandler.updateCart);
router.delete('/carts/:userId', cartHandler.deleteCart);

module.exports = router;
