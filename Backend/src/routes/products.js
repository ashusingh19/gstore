import {getAllCategory} from "../controllers/product/category.js";
import {getProductByCategoryId} from "../controllers/product/product.js";

export const categoryRoutes = async (fastify,option)=>{
    fastify.get("/categories", getAllCategory);
};

export const productRoutes = async (fastify,option)=>{
    fastify.get("/product/:categoryId",getProductByCategoryId);
};