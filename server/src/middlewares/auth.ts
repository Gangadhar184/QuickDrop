import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { success } from "zod";


declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

// export const userAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Read the token from cookies
//     const { token } = req.cookies;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied, No token provided",
//       });
//     }
    
//     // Validate the token
//     const decodedObjToken = jwt.verify(token, "gangadhar") as { _id: string };

//     const user = await User.findById(decodedObjToken._id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token - User not found",
//       });
//     }
    
//     req.user = user;
//     next();
//   } catch (error: any) {
//     console.error("Auth middleware error:", error);
//     res.status(401).json({
//       success: false,
//       message: "Invalid token",
//       error: error.message
//     });
//   }
// };


export const userAuth = async(req:Request, res: Response, next: NextFunction) => {
  try{
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({
        success: false,
        message:"Access denied. No token provided in headers",
      })
    }

    //get token from header
    const token = authHeader.split(" ")[1] //removing bearer prefix

    //decode to verify
    const decoded = jwt.verify(token, "gangadhar") as {_id: string};

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }
    req.user = user;
    next();
  }catch (error: any) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}
