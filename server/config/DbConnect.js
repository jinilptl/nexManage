import mongoose from "mongoose";
const Dbconnect=async ()=>{

    try {

        const DB = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("--------- mongo Db connected ---------- ");
        
        
    } catch (error) {
        console.log("database connection error ",error);
        process.exit(1)
        
    }
}

export default Dbconnect;