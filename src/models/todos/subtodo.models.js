import mongoose from "mongoose";

const subTodos = new mongoose.Schema({
   content:{
    type: String,
    require: true,
   },
   complete:{
    type: Boolean,
    default: false
   },
   createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
   }
},{timestamps:true});

const SubTodos = mongoose.model("subTodo", subTodos);