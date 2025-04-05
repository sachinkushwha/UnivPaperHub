const Home=require('../models/qp');
const rootDir=require('../utils/pathutils');
const path=require('path');
exports.getHome=async(req,res,next)=>{
    const pd=await Home.find();
    const sem=pd.map((data)=>data.semester);
    const semester=[...new Set(sem)];
    console.log(semester);
    Home.find().then(qpdata=>{
        res.render('index',{islogedin:req.session.isLogedin,qpdata,semester});
    })
    
}

exports.getDetails=(req,res,next)=>{
    res.render('viewitem',{islogedin:req.session.isLogedin});
}
exports.getViewPaper=(req,res,next)=>{
    Home.findById(req.params.id).then((oneqp)=>{
        res.render('viewpaper',{oneqp});
    });
}
exports.getdownload=(req,res,next)=>{
    Home.findById(req.params.id).then((oneqp)=>{
        
        
        const imgpath=oneqp.photo.replace(/\\/g, '/');
        console.log(imgpath);
        const imagpaths=path.join(rootDir,imgpath);
        console.log(imagpaths);
        res.download(imagpaths);
    });
}