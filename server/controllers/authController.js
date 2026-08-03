import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

    const token = jwt.sign({
      id: user._id,
    },process.env.JWT_SECRET,{
        expiresIn:'7d'  // expires the token in 7 days
    });

    res.cookie('token',token {
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        maxAge:7*24*60*60*1000 // convert 7 days to milliseconds
    })


  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};
