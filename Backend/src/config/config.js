import "dotenv/config.js";
import ConnectMongoDBSession from "connect-mongodb-session";
import fastifySession from "@fastify/session";
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession)

export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})

sessionStore.on('error',(error)=>{
    console.log("session store error",error)
})

export const authenticate = async (email,password)=>{
   //first time entry
    if (email&& password){
        if(email =="ashu@gmail.com" && password==="123456"){
            return Promise.resolve({email:email ,password:password})
        }else{
            return null
        }
    }


   //uncommment this  when admin create manually
    // if (email && password){
    //     const user = await Admin.findOne({email});
    //     if (!user){
    //         return null
    //     }
    //     if(user.password === password){
    //         return Promise.resolve({email:email,password:password})
    //     }else{
    //         return null
    //     }
    // }
}