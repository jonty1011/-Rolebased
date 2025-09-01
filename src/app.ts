// module imported
import express, { Application } from "express";
import dotenv from 'dotenv';

//routes imports 
import indexRoutes from "./routes/index.routes";
const app:Application = express();

dotenv.config();

const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/',indexRoutes);

//server listening on port
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})