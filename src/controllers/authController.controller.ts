import { Request,Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { statusCodes } from "../constants/statusCodes.constants";
import db from "../models";

const  { User ,Role} = db   

export const register = async(req:Request,res:Response) =>{
  try{
    // this is my userInfo object for req.body
     const userInfo = {
      userName:req.body.userName,
      email:req.body.email,
      password:req.body.password,
     }

     // rolename field of role table for req.body
     const {roleName} = req.body

     // find user with email and check the condition if user is present then give res
     const userExist = await User.findOne({
      where:{
        email:userInfo.email},
     });

     if(userExist){
      res.status(statusCodes.CONFLICT).json({
        success:false,
        message:"user already exists",
      })
      return
     }

     // hashing the user password
     const hashedPassword = await bcrypt.hash(userInfo.password,10);
     userInfo.password = hashedPassword;

     // creating a new user for User model 
     const newUser = await User.create({
      userName:userInfo.userName,
      email:userInfo.email,
      password:hashedPassword,
     });

     // to add role to get to know who is user and other
     const  assignedRoleName = roleName || "User"
     
     // finding that user provided role in req.body is present in role model
     const role = await Role.findOne({where:{roleName:assignedRoleName}});

     //throw res error if role is not present
     if(!role){
      res.status(statusCodes.NOT_FOUND).json({
        success:false,
        message:`Role "${assignedRoleName} not found`
      })
      return;
     }

     // this is sequelize geneated method from many-to-many association which add data in userRole table
     await newUser.addRole(role);

     // res of user created 
     res.status(statusCodes.CREATED).json({
      userId :newUser.userId,
      userName:newUser.userName,
      email:newUser.email,
      status:newUser.status,
      role:role.roleName
     })

  }catch(error:any){
    // if any internal server error then code will go here 
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"something went wrong",
      error:error.message
    });
  }
}

export const login = async(req:Request,res:Response)=>{
  try{
   
    const userInfo ={
      email:req.body.email,
      password:req.body.password
    }

    const userExist = await User.findOne({
      where:{
        email:userInfo.email,
         
      }
    });

    if(!userExist){
      res.status(statusCodes.NOT_FOUND).json({
        success:false,
        message:"user's email id  not found "
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(userInfo.password,userExist.password);
    
    if(!isPasswordValid){
      res.status(statusCodes.UNAUTHORIZED).json({
        success:false,
        message:"Invalid Password! , Please Enter Valid Password"
      });
      return;
    }

    const payload = {
      userId:userExist.userId,
      email:userExist.email
    }

    const jwtSecret = process.env.SECRET_KEY as string;
    const token = jwt.sign(payload,jwtSecret,{
      expiresIn:"1h"
    });  

    res.status(statusCodes.OK).json({
      success:true,
      message:"login successfully",
      data:{
          userId:userExist.userId,
          userName:userExist.userName,
          email:userExist.email,
          token
      }
    })
  }catch(error:any){
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"something went wrong",
      error:error.message
    });
  }
}