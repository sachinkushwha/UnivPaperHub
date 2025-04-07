const {check,validationResult} =require('express-validator');
const bcrypt=require('bcryptjs');
const User=require('../models/user');

exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{islogedin:req.isLogedin});
}
exports.postLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    // console.log(logindata);
    const user=await User.findOne({email});
    if(!user){
        console.log('user does not exist');
        return res.redirect('/login');
    }
    const ismatch=await bcrypt.compare(password,user.password);
    if(!ismatch){
        console.log('wrong password');
        return res.redirect('/login');
    }
    req.session.isLogedin=true;
    req.session.user=user;
    res.redirect('/');
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
}
exports.getRegister=(req,res,next)=>{
    res.render('auth/register',{islogedin:req.isLogedin});
}
exports.postRegister=[
    check('fullname')
    .trim()
    .isLength({min:2})
    .withMessage('first name should be atlist 2 charector')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('name should only be alphabet'),

    check('email')
    .isEmail()
    .withMessage('please enter a valid email')
    .normalizeEmail(),

    check('password')
    .isLength({min:4})
    .withMessage('please enter minimum 4 charector'),
    
    
    (req,res,next)=>{
        const {fullname,email,password}=req.body;
        const error=validationResult(req);
        if(!error.isEmpty()){
            console.log(error);
            return res.redirect('/register');
        }
        bcrypt.hash(password,12).then(pass=>{
            const user=new User({fullname,email,password:pass});
            return user.save();
        })
        .then(()=>{
            res.redirect('/login');
        })
        .catch(err=>{
            console.log('user not register',err);
            res.redirect('/register');
        })
}]