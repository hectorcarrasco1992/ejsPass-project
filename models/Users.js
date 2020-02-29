const mongoose = require('mongoose')

const UserSchema  = new mongoose.Schema({
    name:{type:String,default:'',lowercase:true},
    email:{type:String,unique:true,default:"",lowercase:true},
    password:{type:String,default:''},
})

module.exports = mongoose.model('user',UserSchema)