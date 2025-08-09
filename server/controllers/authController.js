import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
//register
export const register = async (req,res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.json({success:false, message:"Missing Details"})
    }
    try {

        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"User Already Exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name,email,password:hashedPassword})
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge:3*24*60*60*1000
        })
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email Address',
            text: `Hello ${name},\n\nPlease click on the link below to verify your email address:\n\n${process.env.FRONTEND_URL}/verify-email/${token}\n\nThank You!`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true, message:"User Registered Successfully",token})
    } catch (error) {
        return res.json({success: false, message:error.message})
    }
}
//login
export const login = async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({success:false, message:"Email and Password are required."})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message:'Invalid email'})
        }
        const ismatch = await bcrypt.compare(password, user.password)
        if(!ismatch){
            return res.json({success:false, message:'Invalid Password'})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge:3*24*60*60*1000
        })
        return res.json({success:true, message:"User Logged In Successfully",token})
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}
//logout
export const logout = async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none':'strict',
        });
        return res.json({success:true, message:"User Logged Out Successfully"})
    } catch (error) {
    return res.json({success:false, message:error.message})        
    }
}
//send verify otp
export const sendVerifyOtp = async (req,res)=>{
 try {
    const userId = req.userId;
    if(!userId){
        return res.json({success:false, message:"User ID is required"})
    }
    const user = await userModel.findById(userId);
    if(!user){
        return res.json({success:false, message:"User Not Found"})
    }
    if(user.isAccountVerified){
        return res.json({success:false, message:"User Already Verified"})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;
    await user.save();
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Verify Your Email Address',
        text: `Hello ${user.name},\n\nPlease use the following OTP to verify your email address:\n\n${otp}\n\nThank You!`
    }
    await transporter.sendMail(mailOptions);
    return res.json({success:true, message:"OTP Sent Successfully on your email"})
} catch (error) {
    res.json({success:false, message:error.message})
 }   
}
//verify the email using otp
export const verifyEmail =async(req,res)=>{
    const userId = req.userId;
    const {otp} = req.body;
    if(!userId || !otp){
        return res.json({success:false, message:"User ID and OTP are required"})
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User Not Found"})
        }
        if(user.isAccountVerified){
            return res.json({success:false, message:"User Already Verified"})
        }
        if(user.verifyOtp !== otp || user.verifyOtp === ""){
            return res.json({success:false, message:"Invalid OTP"})
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:"OTP Expired"})
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success:true, message:"Email Verified Successfully"})
    }
    catch (error) {
        res.json({success:false, message:error.message})
    }
}
//check if user is authenticated
export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success:true, message:"User is authenticated"})
    }catch (error) {
        res.json({success:false, message:error.message})
    }
}
//send password reset otp
export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false, message:"Email is required"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User Not Found"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Hello ${user.name},\n\nPlease use the following OTP to reset your password:\n\n${otp}\n\nThank You!`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true, message:"OTP Sent Successfully on your email"})
    }catch (error) {
        res.json({success:false, message:error.message})
    }
}
// verify reset otp
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.resetOtp !== otp || !user.resetOtp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }
        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//reset password
export const resetPassword = async (req,res)=>{
    const {email, password, otp} = req.body;
    if(!email || !password || !otp){
        return res.json({success:false, message:"Email, OTP and Password are required"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User Not Found"})
        }
        if(user.resetOtp !== otp || user.resetOtp === ""){
            return res.json({success:false, message:"Invalid OTP"})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message:"OTP Expired"})
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({success:true, message:"Password Reset Successfully"})
    }catch (error) {
        res.json({success:false, message:error.message})
    }
}
    

