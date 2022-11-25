const app=require('./app');
require('dotenv').config();
const ConnectWithDB=require('./config/db');

//DB connection 
ConnectWithDB();

app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is up and runing at port : ${process.env.PORT}`);
});