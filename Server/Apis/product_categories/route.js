const express = require('express');
const router = express.Router();
const categoryHandler = require('./handler');
const { isAdmin } = require('../../helpers/jwt');

router.post('/category', isAdmin, categoryHandler.createCategory);
router.get('/category/:id', isAdmin, categoryHandler.getCategoryById);
router.put('/category/:id', isAdmin, categoryHandler.updateCategory);
router.delete('/category/:id', isAdmin, categoryHandler.deleteCategory);
//list
router.get('/category', isAdmin, categoryHandler.getAllCategories);

module.exports = router;
