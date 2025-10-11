import  jwt  from "jsonwebtoken";
export const verifyToken = async(req,res)=>{
    try {
        const authHeader = req.headers["authorized"];
        if(!authHeader || !authHeader.startswith("Bearer")){
            return res.status(401).json({message:"Acess token required"});
        }
        const token = authHeader.split( " ")[1];
        const decoded = jwt.verify(token,ACCESS_TOKEN_SECRET);
        req.user =decoded;
        return true;
    } catch (error) {
     return res.status(403).json({message:"invalid or expired token"});   
    }
}