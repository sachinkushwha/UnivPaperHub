const express=require('express');
const mongoose=require('mongoose');
const app=express();
const session=require('express-session');
const mongoSessionStorage=require('connect-mongodb-session')(session);
const userRouter=require('./router/userRouter');
const authRouter=require('./router/authRouter');
const hostRouter=require('./router/hostRouter');
const multer=require('multer');
const path=require('path');
const rootDir=require('./utils/pathutils');
const mongoUri= "mongodb+srv://sachin:kumar@airbnb.48epv.mongodb.net/agc?retryWrites=true&w=majority&appName=airbnb";


const mulstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"_"+file.originalname);
    }
});
const filefilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const multerOptions={
    storage:mulstorage,filefilter
}
app.use(multer(multerOptions).single('photo'));
app.use(express.urlencoded());
app.use('/viewpaper/uploads',express.static(path.join(rootDir,'uploads')));
app.set('view engine','ejs');
app.set('views','views');

const storage=new mongoSessionStorage({
    uri:mongoUri,
    collection:'session'
});

app.use(session({
    secret:'agcpyqp-secret-key',
    resave:false,
    saveUninitialized:true,
    store:storage
}));
app.use((req,res,next)=>{
   req.isLogedin=req.session.isLogedin;
   next();
})

app.use(authRouter);
app.use(userRouter);
app.use((req,res,next)=>{
    if(req.isLogedin){
        next();
    }else{
        res.redirect('/');
    }
})
app.use(hostRouter);
mongoose.connect(mongoUri).then(()=>{
    app.listen(3000,()=>{
        console.log('server start on http://localhost:3000');
    })
})
