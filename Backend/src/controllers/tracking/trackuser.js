import {Customer,DeliveryPartner} from "../../models/index.js";
export const updateUser = async (req,res)=>{
    try {
        const {userId} = req.user;
        const updateData = req.body;
        let user = await CustomElementRegistry.findById(user) || await DeliveryPartner.findById(userId);
        if (!user){
            return res.status(404).json({message:"user not found"});
        }

        let UserModel;
        if (user.role === "Customer"){
            UserModel = Customer;

        }else if(user.role === "DeliveryPartner"){
            UserModel = DeliveryPartner;
        }else{
            return res.status(400).json({message:"invalid user role "});
        }
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set:updateData},
            {new:true,runValidators:true}
        );
        if(!updateUser){
            return res.status(404).json({message:"user not found"});
        }
            return res.send({
            message:"user update successfully",
            user:updateUser,
            });
        
    } catch (error) {
        return res.status(404).json({message:"userupdate not found ",error});
    }
}