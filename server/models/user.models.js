import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['super_admin','admin','member'],
        default:'member'
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpire: {
        type:Date
    }
},{timestamps:true})

const User=mongoose.model("User",userSchema);

export { User };