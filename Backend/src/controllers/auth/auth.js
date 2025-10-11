import {Customer,DeliveryPartner} from "../../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (user) =>{
    const accessToken = jwt.sign(
        {userID:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'2d'}
    )

    const refreshToken = jwt.sign(
        {userID:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )
    return{ accessToken,refreshToken}
}

export const loginCustomer = async(req,res)=>{
    try {
        const {phone} = req.body;
        let customer = await Customer.findOne({phone});
        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated:true
            })
            await customer.save()
        }
        const{accessToken,refreshToken} = generateToken(customer)
        return res.send({
            message:"login successfully",
            accessToken,
            refreshToken,
            customer,
        });
    } catch (error) {
        return res.status(500).json({message:"error occured in login customer",error});
    }
}
export const loginDeliveryPartner = async(req,res)=>{
      try {
        const {email,password} = req.body;
        const deliveryPartner = await DeliveryPartner.findOne({email});
        if (!deliveryPartner){
            return res.status(404).json({message:"delivery partner not found"});
        }
        const isMatch = password === deliveryPartner.password;
        if(!isMatch){
           return res.status(400).json({message:"invalid credential"});
        }
        const {accessToken,refreshToken}= generateToken(deliveryPartner);
        return res.send({
            message:"login partner successfull",
            refreshToken,
            accessToken,
            deliveryPartner,
        
        });
           
      } catch (error) {
        return res.status(500).json({message:"an error occured in login delivery partner",error});
      }
};

export const refreshToken = async (req,res)=>{
    const {refreshToken}= req.body;
    if(!refreshToken){
        return res.status(401).json({message:"refresh token required"});
    }
    try {
       const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET) ;
       let user;
       if(decode.role === "Customer"){
        user = await Customer.findById(decode.userID);
       }else if(decode.role === "DeliveryPartner"){
        user = await DeliverPartner.findById(decode.userID);
       }else{
        return res.status(403).send({message:"invalid role"});
       }
       if (!user){
        return res.status(403).send({message:"user not found"});
       }
       const {accessToken,refreshToken:newRefreshToken} = generateToken(user);
       return res.send({
        message:"token refreshed",
        accessToken,
        refreshToken:newRefreshToken,
       });
    } catch (error) {
      return res.status(403).json({message:"invalid refresh token",error})  ;
    }
}

//this is for fetch user and update see in his profile not other`s
export const fetchUser = async (req,res)=>{
    try {
        const {userID,role} = req.user;
        let user ;
          if(role === "Customer"){
        user = await Customer.findById(userID);
       }else if(role === "DeliveryPartner"){
        user = await DeliverPartner.findById(userID);
       }else{
        return res.status(403).send({message:"invalid role"});
       }
       if (!user){
        return res.status(403).send({message:"user not found"});
       }
       return res.send({
        message:"user fetched successfully",
        user,
       });
    } catch (error) {
        return res.status(500).send({message:"an error occured in user fetch ",error});
    }
}