const express = require('express');
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/userRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const forgotpasswordRoutes = require('./routes/forgotRoutes');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

const app = express();
// app.use(helmet())
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// )
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)
app.use('/user', userRoutes);
app.use('/purchase',purchaseRoutes)
app.use('/premium', premiumRoutes);
app.use('/password', forgotpasswordRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.e91g1kn.mongodb.net/`, { dbName: process.env.DB_NAME })
.then(
app.listen(3000,()=>{
  console.log('no error');
}))
.catch(err=>{console.log(err);})
