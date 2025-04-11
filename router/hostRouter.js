const express=require('express');
const hostRouter=express.Router();
const hostController=require('../controller/host');

hostRouter.get('/upload',hostController.getUpload);
hostRouter.post('/upload',hostController.postUpload);
hostRouter.get('/home',hostController.getHome);
hostRouter.post('/delete/:id',hostController.postDelete);

module.exports=hostRouter;