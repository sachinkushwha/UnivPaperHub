
const Home=require('../models/qp');
exports.getUpload=(req,res,next)=>{
    res.render('upload',{islogedin:req.session.isLogedin});
}
exports.postUpload=(req,res,next)=>{
    const {semester,subject,year}=req.body;
    console.log(semester,subject,year);
    console.log(req.files);
    const photos=req.files.map(file=>({
        photo:file.path,
        originalname:file.originalname
    }));
    // const photo=req.files.path;
    // const originalname=req.files.originalname;
    const home=new Home({semester,subject,year,photos});
    home.save().then(()=>{
        res.redirect('/');
    });
}