import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
  path: './.env'
})

connectDB()





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