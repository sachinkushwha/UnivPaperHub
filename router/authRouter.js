const express=require('express');
const authRouting=express.Router();
const authController=require('../controller/auth');

authRouting.get('/login',authController.getLogin);
authRouting.post('/login',authController.postLogin);
authRouting.post('/logout',authController.postLogout);
authRouting.get('/register',authController.getRegister);
authRouting.post('/register',authController.postRegister);
authRouting.get('/forgot',authController.getForgotpage);
authRouting.post('/sendotp',authController.postOptSend);
authRouting.post('/matchotp',authController.postMatchOtp);
authRouting.post('/changpassw',authController.postChangepassw);
module.exports=authRouting;