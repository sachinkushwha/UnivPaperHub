const {cloudinary}=require('../cloudinaryConfig');
const Home = require('../models/qp');
exports.getHome = async (req, res, next) => {
    const user = req.session.user._id;
    const userData = await Home.find();
    const usrdi = userData.filter(ifs => ifs.user.includes(user));
    const sem = usrdi.map((data) => data.semester);
    const semester = [...new Set(sem)];
    res.render('host/user-home', { islogedin: req.session.isLogedin, qpdata: usrdi, semester });
}
exports.getUpload = (req, res, next) => {
    res.render('upload', { islogedin: req.session.isLogedin });
}
exports.postUpload = (req, res, next) => {
    const { semester, subject, year, papertype } = req.body;
    const user = req.session.user._id;
    const photos = req.files.map(file => ({
        photo: file.path,
        originalname: file.originalname,
        public_id: file.filename
    }));
    const home = new Home({ semester, subject, year, photos, papertype, user });
    home.save().then(() => {
        res.redirect('/');
    });
}
exports.postDelete = async (req, res, next) => {
    const postid = req.params.id;
    let postdata = await Home.findOne({ _id: postid });
    postdata=postdata.photos;
    const publicid=postdata.map(item=>item.public_id);
    cloudinary.api.delete_resources(publicid,(err,result)=>{
        if(!err){
            Home.findByIdAndDelete(postid).then(()=>{
                res.redirect('/home');
            })
            
        }else{
            res.send('post not delete');
        }
       
    })
    
}