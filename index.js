const app=require('./app');
require('dotenv').config();
const ConnectWithDB=require('./config/db');
const cloudinary =require('cloudinary');

//DB connection 
ConnectWithDB();

//image handler
cloudinary.config({
    cloud_name:process.env.CLOUDNIARY_NAME,
    api_key:process.env.CLOUDNIARY_API,
    api_secret:process.env.CLOUDNIARY_SECRET
});
app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is up and runing at port : ${process.env.PORT}`);
});