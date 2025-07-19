import { Request, Response } from "express";
import bcrypt from 'bcrypt'

import User from "../models/User";
import { validateSignUpData, validateSignInData } from "../utils/validations";

export const signUp = async (req:Request, res:Response) => {
    try{
      const { fullName, email, password } = validateSignUpData(req);

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    //create instance to class which is user
    const user = new User({
        fullName, email, password: passwordHash
    });
    await user.save();
       res.status(201).json({ 
            message: "User created successfully"
        });
    }catch(error: any){
        console.error("SignUp error:", error);
        res.status(400).json({ error: "Error creating user: " + error.message });
    }
    

}
export const signIn = async (req:Request, res:Response) => {
    try{
        const {email, password} = validateSignInData(req.body);

        //compare login details
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //create jwt token comes from usermodel schema
            const token =  user.getJWT();
            

            //cookies - add token to cookies and send 
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 360000), httpOnly:true, secure: process.env.NODE_ENV === "production", sameSite: "strict"});
            res.json({ 
            message: "Login successful",
           
        });
        }else{
            throw new Error("Invalid creds")
        }
    }catch(error: any){
        res.status(400).send("Error in saving userData: "+error.message);
    }

}
export const logOut = async (req:Request, res:Response) => {
    try{
        res.cookie("token", "", {
            expires: new Date(Date.now())
        });
       res.json({ message: "Logout successful" });
    }catch(error:any){
        console.error("Logout error:", error);
        res.status(500).json({ error: "Logout failed: " + error.message });

    }
}
