const express = require('express');
const router = express.Router();
const orderHandler = require('./handler'); // Adjust path as needed

router.post('/orders', orderHandler.createOrder);
router.get('/orders/:id', orderHandler.getOrderById);
router.get('/orders', orderHandler.getAllOrders);
router.put('/orders/:id', orderHandler.updateOrder);
router.delete('/orders/:id', orderHandler.deleteOrder);

module.exports = router;
