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
const {storages}=require('./cloudinaryConfig');
require('dotenv').config();
// const mongoUri= "mongodb+srv://sachin:kumar@airbnb.48epv.mongodb.net/agc?retryWrites=true&w=majority&appName=airbnb";

// for seo
app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://agcpyqp-1.onrender.com/</loc>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://agcpyqp-1.onrender.com/about</loc>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://agcpyqp-1.onrender.com/login</loc>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://agcpyqp-1.onrender.com/register</loc>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://agcpyqp-1.onrender.com/contact</loc>
      <priority>0.5</priority>
    </url>
  </urlset>`);
  });

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
  Allow: /
  Sitemap: https://agcpyqp-1.onrender.com/sitemap.xml`);
  });
//for seo

app.use(multer({storage:storages}).array('photo',5));
app.use(express.urlencoded());
app.use(express.json());
app.use('/viewpaper/uploads',express.static(path.join(rootDir,'uploads')));
app.use(express.static(path.join(rootDir,'public')));
app.set('view engine','ejs');
app.set('views','views');

const storage=new mongoSessionStorage({
    uri:process.env.MONGO_URI,
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
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('server start on http://localhost:3000');
    })
})
