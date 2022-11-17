const app=require('./app');
require('dotenv').config();


app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is up and runing at port : ${process.env.PORT}`);
});