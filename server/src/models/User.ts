import  { Document, Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



// TS interface for the methods
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  getJWT(): string;
  validatePassword(passwordByUser: string): Promise<boolean>;
}

//schema
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      maxLength: [50, "Full name cannot exceed 50 characters"],
      trim: true,
   
    },
   email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            unique: true,
            trim: true,
            index: true, 
        },
    password: {
            type: String,
            required: [true, "Password is required"],
        },
  },
  { timestamps: true }
  
);

//  Add methods to schema
userSchema.methods.getJWT = function () {
  const user = this as IUser;
  return jwt.sign({ _id: user._id }, "gangadhar", {
    expiresIn: "1d",
  });
};

userSchema.methods.validatePassword = async function (passwordByUser: string) {
  const user = this as IUser;
  return await bcrypt.compare(passwordByUser, user.password);
};

// Create and export the model
const User = model<IUser>("User", userSchema);
export default User;
