const express=require('express');
const authRouting=express.Router();
const authController=require('../controller/auth');

authRouting.get('/login',authController.getLogin);
authRouting.post('/login',authController.postLogin);
authRouting.post('/logout',authController.postLogout);
authRouting.get('/register',authController.getRegister);
authRouting.post('/register',authController.postRegister);
module.exports=authRouting;