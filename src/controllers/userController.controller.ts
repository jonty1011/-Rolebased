import bcrypt from 'bcrypt';    
import { Request ,Response } from "express";
import { statusCodes } from "../constants/statusCodes.constants";
import { User } from "../models/user.models";
import { Role } from "../models/role.models";

export const getUserProfile = async(req:Request,res:Response)=>{
    try{

        const userId = req.currUser.userId;

        const user = await User.findOne({
            where:{
                userId
            },
            attributes:["userId","userName","email","status"]
        });

        res.status(statusCodes.OK).json({
            success:true,
            data:user
        })
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        });
    }
}

export const updateProfile = async(req:Request,res:Response)=>{
    try{ 
        const userId = req.currUser.userId;

        const {userName, email,password} = req.body;

        const updatePayload: { userName?: string; email?: string; password?: string } = {};

        if(userName) updatePayload.userName = userName;
        if(email) updatePayload.email = email;
        if(password){
            updatePayload.password = await bcrypt.hash(password,10);
        }

        const userUpdates = await User.update(updatePayload,{
          where:{
            userId
          },
          returning:true,   
        });

        if(!userUpdates){
            res.status(statusCodes.NOT_FOUND).json({
                success:false,
                message:"user not found",
            });
        }
      
        res.status(statusCodes.OK).json({
            success:true,
            message:"profile updated successfully",
            data:{
                userId:userId,
                ...updatePayload,   
            }
        })
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

export const deactivateSelf = async(req:Request,res:Response)=>{
    try{

        const userId = req.currUser.userId;

        const userAffected = await User.update(
            {status:"inactive"},
            {
                where:{
                    userId
                }
            }
        );  

        if(!userAffected){
            res.status(statusCodes.NOT_FOUND).json({
                success:false,
                message:"user not found or already deactivated",
            });
            return;
        }

        res.status(statusCodes.OK).json({
            success:true,
            message:"user account deactivated successfully"
        });
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        });
    }
};

 export const getAllUsers = async(req:Request,res:Response)=>{
        try{

            const user = await User.findAll({
                include:[{model:Role,as:"roles",
                    attributes:["roleName"],
                    through:{attributes:[]}}]
            })

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

export const getUserById = async(req:Request,res:Response)=>{
    try{
     
        const userId = req.params.userId;

        const user = await User.findByPk(userId,{
            include:[{model:Role,as:"roles", attributes:["roleName"],through:{attributes:[]}}],
        }
        );

        if(!user){
            res.status(statusCodes.NOT_FOUND).json({
                success:false,
                message:"user not found",
            });
            return;
        }

        res.status(statusCodes.OK).json({
            success:false,
            message:"user by Id",
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

export const deleteUserById = async(req:Request,res:Response)=>{
    try{
         
        const loggedInUserId = req.currUser.userId; 
        const userId = req.params.userId;

        if(userId === loggedInUserId){
            res.status(statusCodes.FORBIDDEN).json({
                success:false,
                message:"Admin cannot delete their own account",
            });
            return;
        }
        const userAffected = await User.destroy({
            where:{
                userId
            },
        });

        if(!userAffected){
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"user not found",
            });
        }

        res.status(statusCodes.OK).json({
            success:true,
            message:"User deleted successfully"
        });
    }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

