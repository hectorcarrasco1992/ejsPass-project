const express = require('events')
const User = require('../models/Users')
const {check,validationResult}= require('express-validator')
const passport = require('passport') 
const fetch = require('node-fetch')
const bcrypt = require('bcryptjs')  
const flash =require('connect-flash')
module.exports = {
    errorRender:(req,res)=>{
        return res.render('error')
      },

    loginRender:(req, res, next) =>{
        return res.render('login', { title: 'Express' })
        
      },

    movieRender:(req,res)=>{
  
        if(req.isAuthenticated()) {
          // return res.render('error')
          
          const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=';
          const urlEnd = '&language=en-US&page=1';
          const apiKey = process.env.API_KEY
          const img = 'https://image.tmdb.org/t/p/w500';
          fetch(url+apiKey+urlEnd)
          .then((movies) => movies.json())
          .then((movies) => {
            console.log(movies.results)
            const all = movies.results 
            return res.render('movies', { all,img})
          })
          .catch((err) => console.log(err))
        }else{
          return res.redirect('/error')
        }
          
      },
    
    logOut:(req,res)=>{
        // if(req.user === undefined){
      
        //   req.flash('successMessage','no one to logout')
        //   return res.render('logout')
        // }
        req.logOut()
        req.flash('successMessage','you are now logged out')
        return res.redirect('/')
      },

    randomUsersRender:(req, res) => {
        if(req.user === undefined){
          return res.redirect('/error')
        }
        
        const url = 'https://randomuser.me/api/?results=20';
      
        fetch(url)
            .then((res) => res.json())
            .then((users) => {
                const allUsers = users.results.sort((a, b) => (a.name.last > b.name.last) ? 1 : ((b.name.last > a.name.last) ? -1 : 0))
                res.render('random', { allUsers });
            })
            .catch((err) => console.log(err));
      },
    
    optionsRender:(req,res)=>{
        if(req.isAuthenticated()){
          console.log(req.user)
        return res.render('options')
        }else{
          res.redirect('/error')
        }
      
      
      },

    registerRender:(req,res)=>{
        return res.render('register')
      },

    loginErrorRender:(req,res)=>{
        res.render('loginerror')
      },
    myValidater:[
        check('name','Name is required').not().isEmpty(),
        check('email','PLease include valid email').isEmail(),
        check('password','Please include valid password').isLength({min:3})
    ],
    
    registerPostFunc:(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
          console.log(errors)
          return res.render('register',{errors:'all inputs must be filled'})
          
        }
        User.findOne({email:req.body.email}).then((user)=>{
          if(user){
            return res.render('register',{errors:'user exists'})
          }else {
            const user = new User()
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password,salt)
            
            user.name = req.body.name
            user.email = req.body.email
            user.password =  hash
            
            user.save().then(user=>{
              req.login(user,(err)=>{
                if(err){
                  return res.status(500).json({message:'server error'})
                }else{
                  return res.render('options')
                  //next()
                }
              })
              // return res.status(200).json({message: 'User create',user})
            }).catch(err=>console.log(err))
          }
        })
      },
}