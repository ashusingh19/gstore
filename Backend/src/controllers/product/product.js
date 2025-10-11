import Product from "../../models/product.js";
export const getProductByCategoryId = async(req,res)=>{
    const {categoryID}= req.params;
    try {
        const products = await Product.find({category:categoryID})
        .select("-category") //this means remove category from category so u should select it
        .exec();
      return  res.send(products);
    } catch (error) {
      return res.status(500).json({message:"product category error",error}); 
    }
}