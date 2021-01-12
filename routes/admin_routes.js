var express = require('express');
var router = express.Router();
var adminAuthcontroller = require('../admin/controllers/admin_auth_ctrl')
var adminDashBoardController = require('../admin/controllers/admin_dashboard_ctrl')
var adminTaskController  = require('../admin/controllers/admin_tasks_ctrl')
var adminUserController  = require('../admin/controllers/admin_user_ctrl')

module.exports = function(passport){

function authenticationMiddleware(req, res, next) {
	console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/admin/login')
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/admin/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin')
  }
  next()
}
//  Login
router.get('/login', checkNotAuthenticated, adminAuthcontroller.getLogin)
// router.post('/submitLogin', passport.authenticate('local'))
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login',
  failureFlash: true
}))

router.get('/logout', authenticationMiddleware, function(req, res) {
  req.logout();
  res.redirect('/admin/login');
});

// Task Routes
router.get('/', checkAuthenticated, adminDashBoardController.dashboard)
router.get('/all_tasks', authenticationMiddleware, adminTaskController.all_tasks)
router.get('/add_task', authenticationMiddleware, adminTaskController.add_task)
router.post('/save_task', authenticationMiddleware, adminTaskController.save_task)
router.get('/task/:task_id/edit', authenticationMiddleware, adminTaskController.edit_task)
router.post('/task/:task_id/update_task', authenticationMiddleware, adminTaskController.update_task)
router.get('/task/:task_id/delete_task', authenticationMiddleware, adminTaskController.delete_task)

// user routes
router.get('/add_user', authenticationMiddleware, adminUserController.add_user)
router.get('/user/:user_id/edit', authenticationMiddleware, adminUserController.edit_user)
router.get('/users', authenticationMiddleware, adminUserController.get_all_users)
router.post('/user/:user_id/update', authenticationMiddleware, adminUserController.update_user)
router.get('/user/:user_id/delete_user', authenticationMiddleware, adminUserController.delete_user)


router.post('/save_user', authenticationMiddleware, adminUserController.save_user)

	return router;
}
