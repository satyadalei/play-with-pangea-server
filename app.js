require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongoDB = require('./db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();


app.use(cors({
   origin : process.env.ALLOWED_ORGIN1,
   methods:["GET","POST","DELETE","PUT"],
   credentials : true
}));
connectToMongoDB();
app.set('trust proxy', true);
app.use(session({
   secret : process.env.SESSION_SECRET,
   store: MongoStore.create({
      mongoUrl : process.env.MONGO_DB_URL,
      collection : process.env.MONGO_SESSION_COLLECTION
   }),
   resave: false,
   saveUninitialized: false,
   cookie :{
      // in production mode it is http but in deploy mode it is https
      secure : process.env.MODE === "production" ? false : true , 
      maxAge : 1000*60*60, // 1hr
      sameSite : "none"
   }
}))
//secure : true
      console.log(process.env.MODE === "production" ? false : true);
//CORS - Cross Origin Resource Sharing

app.use(express.json());
app.use("/",require("./routes/home"));
app.use("/api/auth",require("./routes/authRoute"));
const port = process.env.PORT || 5000 ;
app.listen(port, ()=>{
   console.log(`App started running at ${port}`);
})