import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async ()=> {
    try {
        const connectionInstansce = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! HOST: ${connectionInstansce.connection.host}`);
    }catch (err){
        console.log("Mongodb connection error ", err)
        process.exit(1)
    }
}

export default connectDB