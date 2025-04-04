
const Home=require('../models/qp');
exports.getUpload=(req,res,next)=>{
    res.render('upload',{islogedin:req.session.isLogedin});
}
exports.postUpload=(req,res,next)=>{
    const {semester,subject,year}=req.body;
    console.log(semester,subject,year);
    console.log(req.file);
    const photo=req.file.path;
    const originalname=req.file.originalname;
    const home=new Home({semester,subject,year,photo,originalname});
    home.save().then(()=>{
        res.redirect('/');
    });
}