const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');


const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
app.use(cors());        /// setup cors properly to only particular ports  

require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utils/connectDb");
connectDb();


const PORT  = process.env.PORT || 5000; // need to setup port value in aenv file


// Routes

app.use('/api/users', require('./api/users'));
app.use('/api/groups', require('./api/groups'));
app.use('/api/images', require('./api/images'));
app.use('/api/pictures', require('./api/pictures'));
app.use('/api/generateData', require('./api/genData'));
app.use('/api/resultpost', require('./api/resultpost'));


app.listen(PORT,()=> {
    console.log(`Server listening on port ${PORT}`);
})