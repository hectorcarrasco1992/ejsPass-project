const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const session =require('express-session')
const path = require('path');
const User = require('./models/Users')
const bcrypt = require('bcryptjs')  
const flash =require('connect-flash')
const fetch = require('node-fetch')
const {check,validationResult}= require('express-validator')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const logger = require('morgan')
const passport = require('passport')      
require('dotenv').config()
require('./lib/passport')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true
}).then(()=>{
  console.log('Mongodb Connected')
}).catch(err=> console.log(`mongo error:${error}`))
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:process.env.SESSION_SECRET,  
  store: new MongoStore({
      url: MONGODB_URI = 'mongodb://localhost/passport',
      mongooseConnection:mongoose.connection,
      autoReconnect:true
  }),
  cookie:{
      secure:false,
      maxAge:600000,
  }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
  res.locals.user = req.user
  res.locals.errors = req.flash('errorMessage')
  res.locals.success = req.flash('successMessage')
  next()
})
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', usersRouter);

module.exports = app;
  