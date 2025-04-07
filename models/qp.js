const mongoose=require('mongoose');

const paper=mongoose.Schema({
    semester:{type:String,required:true},
    subject:{type:String,required:true},
    year:{type:Number,required:true},
    photos:[{
        photo:String,
        originalname:String
    }],
    papertype:{type:String,required:true},
    user:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
        },
    ]
});

module.exports=mongoose.model('Home',paper);