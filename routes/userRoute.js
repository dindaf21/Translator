const { UserController } = require('../controller/userController');

const router = require('express').Router();

router.get('', UserController.getAllUser);

module.exports = router;
