const express = require('express');
const router = express.Router();
const cartHandler = require('./handler'); // Adjust path as needed

router.post('/carts', cartHandler.createCart);
router.get('/carts', cartHandler.getCartByUserId);
router.post('/carts/add', cartHandler.addItemToCart);
router.post('/carts/remove', cartHandler.removeItemFromCart);
router.put('/carts/:userId', cartHandler.updateCart);
router.delete('/carts/:userId', cartHandler.deleteCart);

module.exports = router;
