import { Request,Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { statusCodes } from "../constants/statusCodes.constants"
import { User } from "../interfaces/authInterface.interfces";



export const authMiddleware = async(req:Request,res:Response, next:NextFunction)=>{
    try{
  
        const auth = req.headers.authorization;

        if(!auth || !auth.startsWith("Bearer")){
            res.status(statusCodes.UNAUTHORIZED).json({
                success:false,
                message:"not authorized please login with valid userId",    
            });
            return;
        }else{

            const jwt_secret = process.env.SECRET_KEY as string

            const token = auth.split(" ")[1];   
            const decodedToken = jwt.verify(token,jwt_secret);

            req.currUser = decodedToken as User

            next();
        }
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}