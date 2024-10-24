const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
  

const signup=async(req,res,next)=>{
    const {firstname,lastname,email,password,role,contact,location,gender,age}=req.body;
    // console.log(firstname,lastname,email,password,role,contact,location,gender,age);
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
        // console.log(existingUser);
    }catch(err){
        console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message:"User Already Exists. Please Login"});
    }
    const hashedPassword=bcrypt.hashSync(password);
    const customer= new User({
        firstname,
        lastname,
        email,
        password:hashedPassword,
        role,
        contact,
        location,
        gender,
        age,
    });

    try{
        await customer.save();
    }catch (err){
        console.log(err);
        return res.status(400).json({message:"Error While Registering the User"});
    }

    return res.status(201).json({message:"User Created Successfully"});
}

const login=async(req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    //return res.status(200).json({message:"User not found."})
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        console.log(err);
        return new Error(err);
    }

    if(!existingUser){
        // console.log("user not found");
        return res.status(300).json({message:"User Not Found. Please Register First"})
    }
    const isPasswordCorrect= bcrypt.compareSync(password,existingUser?.password);
    if(!isPasswordCorrect){
        // console.log("Incorrect Password");
        return res.status(500).json({message:"Password Incorrect"})
    }
    const token=jwt.sign({id:existingUser._id},"gautam",{
        expiresIn:"30s"
    });
    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires: new Date(Date.now()+1000*30),
        httpOnly: true,
        sameSite: 'lax',
    })
    return res.status(200).json({message:"Succesfully Logged In", user:existingUser,token})
}

const verifyToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    // console.log("Cookie:",cookies);
    const token=cookies.split('=')[1];
    // const headers=req.headers["authorization"];
    // console.log("Headers:",headers);
    // const token=headers.split(" ")[1];
    if(!token){
        return res.status(400).json({message:'Token not found'})
    }
    jwt.verify(String(token),"gautam",(err,user)=>{
        if(err){
            return res.status(400).json({message:"Invalid token"})
        }
        // console.log("User Id:",user.id);
        req.id=user.id;
    })
    next();
}

const getUser=async(req,res,next)=>{
    const userId=req.id;
    let user;
    try{
        user=await User.findById(userId,"-password");
    }catch(err){
        return new Error(err);
    }
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    return res.status(200).json({user});
}

const getUserProfile=async(req,res,next)=>{
    const userEmail=req.params.email;
    // console.log("useremail:",userEmail);
    let user;
    try{
        user=await User.findOne({email: userEmail});
    }catch(err){
        return new Error(err);
    }
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    return res.status(200).json({user});
}

const CountUsers=async(req,res,next)=>{
    let userscount;
    try{
      userscount= await User.count({});
    //   console.log("Count of users:",userscount);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Error retrieving Users." });
      }
      return res.status(200).json(userscount);
  }

module.exports={signup,login,verifyToken,getUser,getUserProfile,CountUsers};