require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mogodb');

//app config
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();

//middleware
app.use(cors());
app.use(express.json());


//Api routes
app.get('/',(req,res)=> res.send("API Working"));

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
