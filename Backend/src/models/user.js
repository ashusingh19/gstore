import mongoose from "mongoose";
//base user schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    role:{
        type:String,
     enum:["Admin","Customer","DeliveryPartner" ],
     require:true,
    },
    isActivated:{
        type:Boolean,
        default:false
    }
});
//Customer Schema 
const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    role:{
        type:String,
        enum:["Customer"],default:"Customer"
    },
    liveLocation:{
        latitude:{type:Number},
        longitude:{type:Number}
    },
    address:{type:String},
});
//Delivery partner schema
const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
           type:String,
           require:true
    },
    phone:{
        type:Number,
        require:true
    },
     role:{
        type:String,
        enum:["DeliveryPartner"],default:"DeliveryPartner"
    },
    liveLocation:{
        latitude:{type:Number},
        longitude:{type:Number}
    },
    address:{type:String},
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    }

});
const adminSchema = new mongoose.Schema({
     ...userSchema.obj,
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
           type:String,
           require:true
    },
     role:{
        type:String,
        enum:["Admin"],default:"Admin"
    },
});
export const Customer = mongoose.model("Customer",customerSchema);
export const DeliveryPartner = mongoose.model("DeliveryPartner",deliveryPartnerSchema);
export const Admin = mongoose.model("Admin",adminSchema);