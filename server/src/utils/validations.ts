//validations using zod
import { z } from "zod";
import { Request } from "express"
//validate signupdata

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name is required").max(50, "Full name must be atmost 50 characters"),
  email: z.email("Invalid email address").toLowerCase().trim()  ,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) =>
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message: "Password must be strong: include uppercase, lowercase, number, and symbol",
      }
    ),
});
export const signInSchema = z.object({
    email: z
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(1, "Password is required"), 
});


export const validateSignUpData = (req: Request) => {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    const tree = z.treeifyError(result.error);
    throw new Error(JSON.stringify(tree));
  }
  return result.data;
};

export const validateSignInData = (reqBody: any) => { 
    const result = signInSchema.safeParse(reqBody);
    if (!result.success) {
        const tree = z.treeifyError(result.error);
        throw new Error(JSON.stringify(tree));
    }
    return result.data;
};
