const express = require('express');
const router = express.Router();
const userHandler = require('./handler'); // Adjust path as needed
const { authorize } = require('../../helpers/jwt');

router.post('/users', userHandler.createUser);
router.get('/users_data',authorize, userHandler.getUser);
router.put('/users_data',authorize,userHandler.updateUserbydata);

router.get('/users/:id',authorize, userHandler.getUserById);
router.get('/users',authorize, userHandler.getAllUsers);
router.put('/users/:id',userHandler.updateUser);
router.delete('/users/:id',authorize, userHandler.deleteUser);
//login
router.post('/login', userHandler.login);

module.exports = router;
