const {v2:cloudinary}=require('cloudinary');
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:'dt0bypzuu',
    api_key:'474675563199855',
    api_secret:'EUjfZuvDc-L-i4UC6DBipImbXjE'
});
const storages=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'pyqp_uploads',
        allowed_formats:['jpg','png','jpeg']
    }
});

module.exports={cloudinary,storages};