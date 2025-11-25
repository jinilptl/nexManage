import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import teamRouter from './routes/team.routes.js';
import projectrouter from './routes/project.routes.js';

const app= express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

//routes

app.use("/api/v1/user",authRouter)
app.use("/api/v1/team",teamRouter)
app.use("/api/v1/project",projectrouter)


// error handler global formate

app.use((err,req,res,next)=>{
      
    console.log(err)

    const statusCode=err.statusCode || 500;
    const message=err.message || "internal server error "
    const errors=err.errors || []

    res.status(statusCode).json({
        success:false,
        message,
        errors
    })
    
})

app.get('/',(req,res)=>{
    res.send("default route .. welcome to the server of nexmanage")
})

export default app
