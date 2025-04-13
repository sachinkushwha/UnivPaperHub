const mongoose=require('mongoose');

const ContactSchema=mongoose.Schema({
    userName:{type:String,required:true},
    email:{type:String,required:true},
    msg:{type:String,required:true}
});
module.exports=mongoose.model('Contact',ContactSchema);