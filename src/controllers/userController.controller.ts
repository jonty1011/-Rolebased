import { Request ,Response } from "express";
import { statusCodes } from "../constants/statusCodes.constants";
import { User } from "../models/user.models";

export const getAllUsers = async(req:Request,res:Response)=>{
    try{

        const user = await User.findAll()

        res.status(statusCodes.OK).json({
            success:true,
            message:"Users",
            data:user
        })
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}