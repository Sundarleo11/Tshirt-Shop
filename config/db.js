const mongoose=require('mongoose');

const ConnectWithDB=()=>{

    mongoose.connect(process.env.DB_url,{
      useNewURLParser:true,
      useunifiedTopology:true
    })
    .then(console.log('DB Got Connect'))
    .catch(error=>{
       console.log(`DB Connection Got Error`)
       console.log(error)
       process.exit(1);
    })
}


module.exports=ConnectWithDB;