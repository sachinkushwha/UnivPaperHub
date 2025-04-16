const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Otp = require('../models/otp');
exports.getLogin = (req, res, next) => {
    res.render('auth/login', { islogedin: req.isLogedin });
}
exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(logindata);
    const user = await User.findOne({ email });
    if (!user) {
        console.log('user does not exist');
        return res.redirect('/login');
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
        console.log('wrong password');
        return res.redirect('/login');
    }
    req.session.isLogedin = true;
    req.session.user = user;
    res.redirect('/');
}
exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}
exports.getRegister = (req, res, next) => {
    res.render('auth/register', { islogedin: req.isLogedin });
}
exports.postRegister = [
    check('fullname')
        .trim()
        .isLength({ min: 2 })
        .withMessage('first name should be atlist 2 charector')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('name should only be alphabet'),

    check('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),

    check('password')
        .isLength({ min: 4 })
        .withMessage('please enter minimum 4 charector'),


    (req, res, next) => {
        const { fullname, email, password } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            console.log(error);
            return res.redirect('/register');
        }
        bcrypt.hash(password, 12).then(pass => {
            const user = new User({ fullname, email, password: pass });
            return user.save();
        })
            .then(() => {
                res.redirect('/login');
            })
            .catch(err => {
                console.log('user not register', err);
                res.redirect('/register');
            })
    }]

exports.getForgotpage = (req, res, next) => {
    res.render('auth/forgotpassword', { islogedin: req.session.isLogedin });
}
exports.postOptSend = async (req, res, next) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
        console.log('no user find');
        return res.json({ success: false });
    }
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'samtv8169@gmail.com',
                pass: process.env.app_pass
            }
        });
        const mailoptions = {
            from: 'samtv8169@gmail.com',
            to: email,
            subject: 'OTP CODE',
            html: `<h1>your opt code is <b>${otp}</b></h1>`
        };

        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                return console.log('Error:', error);
            }
            console.log('Email sent:', info.response);
        });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const otpuser =await Otp({ email, otp, expiresAt });
        await  otpuser.save();
    } catch (err) {
        console.log(err);
    }
    res.json({ success: true });
}
exports.postMatchOtp = async(req, res, next) => {
    const {otp,email} = req.body;
    // console.log(otp,email);
const user=await Otp.findOne({email});
if(!user){
    return console.log('resend otp agin');
}
// console.log(user.otp);
if(user.otp===otp){
    res.json({ success: true});
    Otp.findOneAndDelete({email}).then(()=>{
    })
}else{
    res.json({success:false});
}
 
}

exports.postChangepassw=async(req,res,next)=>{
    const {password,conPassword,email}=req.body;
  
   const user=await User.findOne({email});
    console.log(user);
    if(!user){
        return  res.json({success:false}); 
    }
    if(password!==conPassword){
       return  res.json({success:false}); 
    }
    const pass=await bcrypt.hash(password,12);
    const update=await User.updateOne({email},{$set:{password:pass}});
    if(update.modifiedCount===0){
     return   res.json({success:false}); 
    }
    res.json({success:true});
   
   
}
 