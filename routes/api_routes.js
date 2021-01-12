var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller')
var dashboardController = require('../controllers/dashboard_controller')
var authController = require('../controllers/auth_controller')

router.route('/login').post(authController.login)
router.route('/signUp').post(usersController.save_user)

router.route('/getNodeJsTrainingData/:name').get(authController.get_data);


module.exports = router;