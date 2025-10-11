import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    price :{
        type:Number,
        require:true
    },
    discountPrice:{
        type:Number
    },
    quantity:{
        type:String,
        require:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        require:true
    }
});
const Product = mongoose.model("Product",productSchema);
export default Product;