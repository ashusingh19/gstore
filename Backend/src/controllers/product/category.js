import Category from "../../models/category.js";
export const getAllCategory = async(req,res)=>{
try {
  const categories  = await Category.find();
  return res.send(categories); 
} catch (error) {
  return res.status(500).json({message:"categories not found ",error});  
}
}