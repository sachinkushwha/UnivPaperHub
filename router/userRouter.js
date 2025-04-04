const express=require('express');
const userRouter=express.Router();
const userController=require('../controller/user');
userRouter.get('/',userController.getHome);
userRouter.get('/details',userController.getDetails);
userRouter.get('/viewpaper/:id',userController.getViewPaper);
userRouter.get('/download/:id',userController.getdownload);

module.exports=userRouter;