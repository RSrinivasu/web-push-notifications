import '@babel/polyfill'
import express from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
//const mongoose = require("mongoose")
import "./model/Subscription"

import index from './router'
import push from './router/push'
import subscribe from './router/subscribe'
import keys from './config/key'

const app = express()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use( (req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

console.log("srinu", keys.mongoURI)

mongoose.Promise = global.Promise

mongoose.connect(keys.mongoURI,
  { useUnifiedTopology: true,
    useNewUrlParser: true  } )
.then(()=>console.log("mongoose connected"))
.catch((err)=> console.log("mongose connect err",err))


app.use("/web-push-notification/v1/", index)
app.use('/web-push-notification/v1/push',push)
app.use('/web-push-notification/v1/subscribe',subscribe)

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


  // Start the application after the database connection is ready
app.listen(3040,  ()=>{
        console.log("Live Port Now",3040)
    })



