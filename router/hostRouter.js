const express=require('express');
const hostRouter=express.Router();
const hostController=require('../controller/host');

hostRouter.get('/upload',hostController.getUpload);
hostRouter.post('/upload',hostController.postUpload);

module.exports=hostRouter;