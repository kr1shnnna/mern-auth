import express from 'express';
import { register, login, logout,sendVerifyOtp,verifyAccount ,isUserAuthenticated,resetOtp,resetUserPassword} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRouter=express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyAccount);
authRouter.post('/is-auth',userAuth,isUserAuthenticated);
authRouter.post('/reset-otp',resetOtp);
authRouter.post('/reset-password',resetUserPassword);






export default authRouter;