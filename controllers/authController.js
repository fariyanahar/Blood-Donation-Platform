import express from "express";
import { userSchema,adminSchema,isValidAdminKey } from "../schemaValidations/regValidation.js";
import { insertUser,insertAdmin } from "../models/regModel.js";
import { searchUser } from "../models/userModel.js";
import { searchAdmin } from "../models/adminModel.js";
import { hashPassword,comparePassword } from "../utils/hashMethods.js";
// import { searchPost } from "../models/postModel.js";
// import { searchConfirmedPost } from "../models/postModel.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();




export const registerController = async (req, res) => {
  try {
    // Validate data
    const validatedData = await userSchema.validateAsync(req.body);
    // Check if email is already in use
    const existingUser = await searchUser(
        { 
            filters : { email: validatedData.email } 
        });

    console.log(existingUser);
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists. Log in!" });
    }
    const hashedPassword = await hashPassword(validatedData.password);
    validatedData.password = hashedPassword;
    // Insert into database
    const insertedUser = await insertUser(validatedData);
    res.status(201).json({
      msg: "User registered successfully!",
      id: insertedUser,
    });

  } catch (err) {
    // Handle joi errs
    if (err.isJoi) {
      return res.status(400).json({
        msg: "Validation error",
        details: err.details.map((error) => error.message),
      });
    }
    // Handle any unexpected errors
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const adminRegisterController = async (req,res)=>{
    try {
      const validatedData = await adminSchema.validateAsync(req.body);
      const existingAdmin = await searchAdmin({
        filters : { email : validatedData.email }
      });
  
      if(existingAdmin.length > 0){
        return res.status(400).json({ msg: "Admin already exists. Log in!" });
      }

      if(!isValidAdminKey(validatedData.adminKey)){
        return res.status(401).json({ msg: "Invalid Admin Key." });
      }
  
      const hashedPassword = await hashPassword(validatedData.password);
      validatedData.password = hashedPassword;
      const insertedAdmin = await insertAdmin(validatedData);
      res.status(201).json({
        msg: "Admin registered successfully!",
        id: insertedAdmin,
      });
    }catch (err) {
      if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Registration error:", err);
      res.status(500).json({ msg: "Internal server error" });
    }

}


export const loginController = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    let dbData = await searchUser({ 
      filters: { email: req.body.email }
    });
    if (!dbData.length) {
      dbData = await searchAdmin({ email: req.body.email });
    }
    if (!dbData.length) {
      return res.status(404).json({ error: "User does not exist" });
    }

    dbData = dbData[0];
    console.log(dbData, req.body.password)
    const isValidPass = await comparePassword(req.body.password, dbData.password);
    if (!isValidPass) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const payload = {
      id: dbData.id,
      email: dbData.email,
      role: dbData.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    if(dbData.role === 'donor'){
      return res.status(200).json({
        msg: "User logged in successfully!",
        token: "Bearer " + token,
        redirect : "/api/donor-dashboard.html"
      });
    } else if( dbData.role === 'recipient'){
      return res.status(200).json({
        msg: "User logged in successfully!",
        token: "Bearer " + token,
        redirect : "/api/recipient-dashboard.html"
      });
    }
    return res.status(200).json({
      msg: "User logged in successfully!",
      token: "Bearer " + token,
      redirect: "/api/admin-dashboard.html"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error, please try again later" });
  }
};
