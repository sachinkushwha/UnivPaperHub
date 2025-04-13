const express=require('express');
const userRouter=express.Router();
const userController=require('../controller/user');
userRouter.get('/',userController.getHome);
userRouter.get('/viewpaper/:id',userController.getViewPaper);
userRouter.get('/download/:id',userController.getdownload);
userRouter.get('/about',userController.getAbout);
userRouter.get('/contact',userController.getContact);
userRouter.post('/contact',userController.postContact);

module.exports=userRouter;