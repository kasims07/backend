import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import app from "./app.js"



dotenv.config({
  path: './.env'
})

connectDB()
.then(() => {
  app.listen(process.env.PORT || 3000, () =>{
    console.log(`Server runing at port : ${process.env.PORT || 3000}`)
  })
})
.catch((err) => {
  console.log("MongoDB connection fail !!", err);
})





// import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constant";
// import { Express } from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", () => {
//       console.log("error", error);
//       throw error;
//     })
//     app.listen(process.env.PORT, ()=>{
//       console.log(`App is listing on ports ${process.env}`);
//     })
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw err;
//   }
// })();