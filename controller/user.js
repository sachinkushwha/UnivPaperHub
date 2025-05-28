const Home = require('../models/qp');
const Contact=require('../models/contact');
const rootDir = require('../utils/pathutils');
const path = require('path');
const axios = require('axios');
const PDFdocument = require('pdfkit');
exports.getHome = async (req, res, next) => {
    const pd = await Home.find();
    const sem = pd.map((data) => data.semester);
    const semester = [...new Set(sem)];
    Home.find().then(qpdata => {
        res.render('index', {pageUrl:req.url, islogedin: req.session.isLogedin, qpdata, semester,pageTitle:'Previous Year Papers | PYQP' });
    })

}


exports.getViewPaper = (req, res, next) => {
    Home.findById(req.params.id).then((oneqp) => {
        oneqp = oneqp.photos;
        res.render('viewpaper', { oneqp });
    });
}
exports.getdownload = async (req, res, next) => {
    const oneqp = await Home.findById(req.params.id);
console.log(oneqp.subject);
    const files = oneqp.photos.map(img => {
        return {
            path: img.photo.replace(/\\/g, '/'),
            name: img.originalname
        }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${oneqp.subject}.pdf`);

    const doc = new PDFdocument();
    doc.pipe(res);
    let i = 0;
    for (const file of files) {
        const response = await axios.get(file.path, { responseType: 'arraybuffer' });

        if (i !== 0) doc.addPage();
        doc.image(response.data, {
            fit: [500, 700],
            align: 'center',
            valign: 'center'
        });
        i++;
    }
    doc.end();
}
exports.getAbout = (req, res) => {
    res.render('about',{islogedin:req.session.isLogedin});
}
exports.getContact=(req,res)=>{
    res.render('contact',{pageUrl:req.url,islogedin:req.session.isLogedin,pageTitle:'Contact Us | PYQP'});
}
exports.postContact=async(req,res)=>{
    const {userName,email,msg}=req.body;
    const contact=await Contact({userName,email,msg});
    await contact.save();
    res.redirect('/');
}

exports.getFilter=async(req,res,next)=>{
    let fil=req.query.semester;
    let papertype=req.query.papertype;
    console.log(papertype);
    if(fil){
       req.session.isSem=fil;
    }
   
    if(fil==="Home"){
       return res.redirect('/');
    }
   
    if(req.session.isSem!=="Home" && papertype){
        const sem=await Home.find({semester:req.session.isSem});
        const paper=sem.filter(pap=>pap.papertype===papertype);
        return res.render('index',{pageTitle:"Previous Year Papers | PYQP",pageUrl:req.url,islogedin:req.session.isLogedin,qpdata:paper,semester:[req.session.isSem]});
    }
    if(papertype){
        console.log(papertype);
        const pape=await Home.find({papertype:papertype});
        let pa=pape.map(da=>da.semester);
        let semester=[...new Set(pa)]
        return res.render('index',{pageTitle:"Previous Year Papers | PYQP",pageUrl:req.url,islogedin:req.session.isLogedin,qpdata:pape,semester});
    }
    const sem=await Home.find({semester:fil});
    res.render('index',{pageTitle:"Previous Year Papers | PYQP",pageUrl:req.url,islogedin:req.session.isLogedin,qpdata:sem,semester:[req.query.semester]});
}