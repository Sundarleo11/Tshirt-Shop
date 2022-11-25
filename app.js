const express = require('express');
require("dotenv").config();
const app = express()
const morgan = require('morgan');
const fileupeload = require('express-fileupload');
const cookieparser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');


// swagger document
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//reguler middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cokkies and files from middleware
app.use(fileupeload(
    fileupeload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
));
app.use(cookieparser());

// morgen middleware
app.use(morgan('tiny'));

//import the all routers
const home = require('./routes/home');
const User = require('./routes/User');

//routes from middleware
app.use("/api/v1", home);
app.use("/api/v1", User);

//export the app js
module.exports = app