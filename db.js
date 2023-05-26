const mongoose = require('mongoose');
const mongoDBUrl = process.env.MONGO_DB_URL;
const connectToMongoDB =  async()=>{
   try {
       await mongoose.connect(mongoDBUrl);
       console.log("Connected to mongo DB successfully");
    }catch (error) {
      console.log('There is some error connecting to mongoDB');
   }
}

module.exports = connectToMongoDB;