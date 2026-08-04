import userModel from '../models/userModel.js';

export const getUserData=async(req,res)=>{

    try{

        const {userId}=req.body;
        const user= await userModel.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'User data fetched successfully',
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:err.message||'internal server error'
        })
    }
}