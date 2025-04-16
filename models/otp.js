const mongoose=require('mongoose');

const forgotSchema=mongoose.Schema({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    expiresAt: { type: Date, required: true,expires:0 }
})

module.exports=mongoose.model('otp',forgotSchema);