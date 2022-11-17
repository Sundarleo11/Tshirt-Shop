const express=require('express');
require("dotenv").config();
const app=express()

//import the all routers
const home=require('./routes/home');

//configuration all the routes from middleware
app.use("/api/v1",home);

//export the app js
module.exports=app