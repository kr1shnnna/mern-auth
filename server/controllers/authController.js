import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from '../config/nodeMailer.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing Required Fields",
    });
  }

  try {
    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save(); // new user is saved to the database

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // expires the token in 7 days
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // convert 7 days to milliseconds
    });

    // to send an welcome email to the user

    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome to our App',
        text:`Hi ${name},\n\nWelcome to our app! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to us.\n\nBest regards,\nThe Team`
    }

    await transporter.sendMail(mailOptions); // it will send the email to the user 
    


    return res.status(201).json({
        success:true,
        message:'User registered successfully'
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email & Password are required",
    });
  }

  try {
    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success:true,
        message:'User logged in successfully'
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};

export const logout= async (req,res)=>{
    try{
        res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })
        return res.status(200).json({
            success:true,
            message:'User logged out successfully'
        })

    }
    catch(err){

    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });

    }
}

// send otp to the user for verification
export const sendVerifyOtp=async(req,res)=>{
  try{

    const {userId}=req.body;

    const user =await userModel.findById(userId);
    if(user.isAccountVerified){
      return res.status(400).json({
        success:false,
        message:'Account is already verified'
      })
    }

  const otp=String(Math.floor( 100000+ Math.random()*900000)) // generate a 6 digit random number

  user.verifyOtp=otp;
  user.verifyOtpExpiryAt=Date.now()+24*60*60*1000; // 24 hours from now

  await user.save();

  const mailOption={
    from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Account Verification OTP',
    text:`Hi ${user.name},\n\nYour OTP for account verification is: ${otp}. It will expire in 24 hours.\n\nBest regards,\nThe Team`
  }
  await transporter.sendMail(mailOption);

  return res.status(200).json({
    success:true,
    message:'OTP sent to your email'
  })



  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
}


export const verifyAccount=async(req,res)=>{

   const {userId,otp}=req.body;
   if(!userId || !otp){
    return res.status(400).json({
        success:false,
        message:'Missing required fields'
    })
   }

   try{

    const user=await userModel.findById(userId);
    if(!user){
        return res.status(404).json({
            success:false,
            message:'User not found'
        })
    }
    if(user.verifyOtp===''|| user.verifyOtp!==otp){
      return res.status(400).json({
        success:false,
        message:'Invalid OTP'
      })
    }
if(user.verifyOtpExpiryAt<Date.now()){
  return res.status(400).json({
    success:false,
    message:'OTP has expired'
  })
}

user.isAccountVerified=true;
user.verifyOtp='';
user.verifyOtpExpiryAt=0;
await user.save();
return res.status(200).json({
  message:'Account verified successfully',
  success:true
})
   }
   catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
   }
}

export const isUserAuthenticated=async(req,res)=>{
  try{
    return res.status(200).json({
      success:true,
      message:'User is authenticated'
    })

  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
}


export const resetOtp=async(req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({
      success:false,
      message:'Email is required'
    })
  }

  try{

    const user=await userModel.findOne({
      email
    })

    if(!user){
      return res.status(404).json({
        success:false,
        message:'User not found'
      })
    }

    const otp=String(Math.floor(100000+Math.random()*900000));
    user.resetOtp=otp;
    user.resetOtpExpiryAt=Date.now()+15*60*60*1000; // expires in 15 minutes

    await user.save();

    const mailOption={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject:'Password Reset OTP',
      text:`Hi ${user.name},\n\nYour OTP for password reset is: ${otp}. It will expire in 15 minutes.\n\nBest regards,\nThe Team`
    }

    await transporter.sendMail(mailOption);
    return res.status(200).json({
      success:true,
      message:'OTP sent to your email'
    })

  }
  catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
}

export const resetUserPassword=async(req,res)=>{

  const {email,otp,newPassword}=req.body;
  if(!email || !otp || !newPassword){
    return res.status(400).json({
      success:false,
      message:'Missing required fields'
    })
  }
  try{

    const user=await userModel.findOne({
      email
    })

    if(!user){
      return res.status(404).json({
        success:false,
        message:'User not found'
      })
    }

    if(user.resetOtp==='' || user.resetOtp!==otp){
      return res.status(400).json({
        success:false,
        message:'Invalid OTP'
      })
    }

    if(user.resetOtpExpiryAt<Date.now()){
      return res.status(400).json({
        success:false,
        message:'OTP has expired'
      })
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    user.resetOtp='';
    user.resetOtpExpiryAt=0;
    await user.save();
    return res.status(200).json({
      success:true,
      message:'Password reset successfully'
    })
  }
  catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
}