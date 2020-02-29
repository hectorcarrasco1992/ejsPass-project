var express = require('express');
var router = express.Router();
const User = require('../models/Users')
const controllerFunc= require('./controller')
const {check,validationResult}= require('express-validator')
const passport = require('passport') 
const fetch = require('node-fetch')
const bcrypt = require('bcryptjs')  
const flash =require('connect-flash')
/* GET home page. */
// router.get('/api/users/login', function(req, res, next) {
//   res.render('login', { title: 'Express' });
// }); 


router.get('/error',controllerFunc.errorRender)
router.get('/api/users/login',controllerFunc.loginRender )
router.get('/auth/movies',controllerFunc.movieRender)
router.get('/api/users/logout',controllerFunc.logOut)
router.get('/auth/random',controllerFunc.randomUsersRender)
router.get('/auth/options',controllerFunc.optionsRender)
router.get('/api/users/register',controllerFunc.registerRender)
router.get('/loginerror',controllerFunc.loginErrorRender)
router.post('/api/users/register',controllerFunc.myValidater,controllerFunc.registerPostFunc)
router.post('/api/users/login', passport.authenticate('local-login',{
  successRedirect:'/auth/options',
  failureRedirect:'/loginerror',
  failureFlash:true
}))



module.exports = router;
