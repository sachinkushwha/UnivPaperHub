const mongoose=require('mongoose');

const paper=mongoose.Schema({
    semester:{type:String,required:true},
    subject:{type:String,required:true},
    year:{type:Number,required:true},
    photo:String,
    originalname:String
});

module.exports=mongoose.model('Home',paper);