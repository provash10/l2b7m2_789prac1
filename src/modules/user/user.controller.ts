import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser =  async (req: Request, res: Response) => {
  // console.log(req.body);
  // const body = req.body; //body destructure
//   const { name, email, password, age } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

 const getAllUser= async (req: Request, res: Response) => {
  console.log(req.user)
  try {
    const result = await userService.getAllUserFromsDB();

    res.status(200).json({
      success: true,
      message: "Users Retrived Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const result =await userService.getSingleUserFromDB(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "Users Retrived Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const updateUser=async (req: Request, res: Response) => {
  const { id } = req.params;
  // const { name, email, password, age, is_active } = req.body;

  // console.log("Id : ", id);
  // console.log({name,email,password,age,is_active})

  try {
  const result = await userService.updateUserFromDB(req.body, id as string)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }


    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const deleteUser=async(req:Request, res: Response)=>{
    const {id} = req.params;

    try {
       const result = await userService.deleteUserFromDB(id as string)
    // console.log(result)
    if(result.rowCount===0){
        res.status(404).json({
        success: false,
        message: "User Not Found",
        
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data: {},
    });
    } catch (error:any) {
        res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
    }
}

export const userController ={
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
}