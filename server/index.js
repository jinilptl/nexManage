import app from './app.js';
import dotenv from "dotenv";
import Dbconnect from './config/DbConnect.js';
dotenv.config();
const PORT=process.env.PORT || 5000;

Dbconnect().then(()=>{
    app.listen(PORT,()=>{
    console.log(`server started on this port ${PORT}`);
    
})
}).catch((err)=>{
    console.error("Failed to connect to the database", err);

})

