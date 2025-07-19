import express from 'express'
import { logOut, signIn, signUp } from '../controllers/authController';


const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/logout', logOut);


export default authRouter;
