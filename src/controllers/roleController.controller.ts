import { Request , Response } from "express";
import { statusCodes } from "../constants/statusCodes.constants";
import { Role } from "../models/role.models";

export const createRole  = async(req:Request , res:Response)=>{
    try{

        const roleName = req.body.roleName;

        if(!roleName){
            res.status(statusCodes.BAD_REQUEST).json({
                success:false,
                message:"roleName is required"
            });
            return;
        }

        const roleExists = await Role.findOne({where:{roleName}});  
        if(roleExists){
            res.status(statusCodes.CONFLICT).json({
                success:false,
                message:"role already exists"
            }); 
            return;
        }

        const role = await Role.create({roleName});

        res.status(statusCodes.CREATED).json({
                success:true,
                message:"Role created successfully",
                data:role
        })
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        });
    }
}

export const getAllRole = async(req:Request, res:Response)=>{
    try{

        const roles = await Role.findAll();

        res.status(statusCodes.OK).json({
            success:true,
            message:"all roles",
            data:roles
        })
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        });
    }
}