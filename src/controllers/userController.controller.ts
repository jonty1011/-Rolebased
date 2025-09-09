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

            // find user with PK check status 
            const user = await User.findByPk(userId);

            // if user not found 
            if(!user){
                res.status(statusCodes.NOT_FOUND).json({
                    success:false,
                    message:"user not found",
                });
                return;
            }


            const now = new Date();

            const inactiveDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000); // 45 days
            
            if(user.status === "inactive"){
                if(user.updatedAt && user.updatedAt < inactiveDate){

                    // Permanently delete user if inactive for more than 45 days
                    await User.destroy({where:{userId}});
                    res.status(statusCodes.OK).json({
                        success:true,
                        message:"Your account has been inactivate for more than 45 days and has been deleted permanently",
                    });
                    return;
                }else{
                    res.status(statusCodes.BAD_REQUEST).json({
                        success:false,
                        message:"your account is already inactive but not yet eligible for permanant deleted"
                    })
                 return;
                }
            }else{
                // Update status to inactive and update 
                user.status = "inactive";
                await user.save();

                res.status(statusCodes.OK).json({
                    success:true,
                    message:"Your account has been deactivated successfully",
                })
            }  

          
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

export const changePassword = async(req:Request,res:Response)=>{
    try{
        const userId = req.currUser.userId;

        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword){
            res.status(statusCodes.BAD_REQUEST).json({
                success:false,
                message:"current password and new password are required"
            });
            return;
        }

        const user = await User.findByPk(userId);

        if(!user){
            res.status(statusCodes.NOT_FOUND).json({
            success:false,
            message:"User not found"
            }); 
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword,user.password!);

        if(!isMatch){
            res.status(statusCodes.NOT_FOUND).json({
                success:false,
                message:"current password is incorrect"
            });
            return;
        }

        const hashedPwd = await bcrypt.hash(newPassword,10);
        user.password = newPassword;

        await user.save(); 

        res.status(statusCodes.OK).json({
            success:true,
            message:"Password changed successfully"
        });
     }catch(error:any){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"something went wrong",
            error:error.message
        });
    }
}

// export const assignRolesToUser = async(req:Request, res:Response)=>{
//     try{
  
//         const userId = req.params.userId;
//         const rolesToAssign :string[] = req.body.roles;

//         if(!Array.isArray(rolesToAssign) || rolesToAssign.length ===0){
//             res.status(statusCodes.BAD_REQUEST).json({
//                 success:false,
//                 message:"Roles array is required and cannot be empty.",
//             });
//             return;
//         }

//         // fetch by userId 

//         const user = await User.findByPk(userId);
//         if(!user){
//             res.status(statusCodes.NOT_FOUND).json({
//                 success:false,
//                 message:`User with ID ${userId} not found.`
//             });
//         }

//         const roles = await Role.findAll({
//             where:{roleName :rolesToAssign}
//         });

//         if(roles.length === 0){
//             res.status(statusCodes.BAD_REQUEST).json({
//                 success:false,
//                 message:"No valid roles found to assign"
//             });
//             return;
//         }

//         await user.setRoles(roles)
//     }catch(error:any){
//         res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//             success:false,
//             message:"something went wrong",
//             error:error.message
//         });
//     }
// }