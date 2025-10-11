import Order from "../../models/order.js";
import Branch from "../../models/branch.js";
import { Customer,DeliveryPartner } from "../../models/user.js";

export const createOrder = async(req,res)=>{
    try {
      const {userId} = req.user;
      const {items , branch , totalPrice} = req.body;
      const customerData = await Customer.findById(userId)
      const branchData = await Branch.findById(branch)
      
      if (!customerData){
        return res.status(404).json({message:"customer not found"});
      }
      const newOrder = ({
        customer :userId,
        items:items.map((item)=>({
            id:item.id,
            item:item.item,
            count :item.count
        })),
        branch,
        totalPrice,
        deliveryLocation:{
            latitude:customerData.liveLocation.latitude,
            longitude:customerData.liveLocation.longitude,
            address:customerData.address || "no address available"
        },
        pickuplocation:{
            latitude:branchData.location.latitude,
            longitude:branchData.location.longitude,
            address:branchData.address || "address not available"
        },
      });
      const savedOrder = await newOrder.save()
      return res.status(201).json(savedOrder)
    } catch (error) {
        console.log(err);
        return res.status(500).json({message:"failed to craete order",error});
    }
}

export const confirmOrder = async(req,res)=>{
try {
    const {orderId} = req.params;
    const {userId} = req.user;
    const {deliveryPersonLoaction} = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);
    if(!deliveryPerson){
        return res.status(404).json({message:"delivery person not found"});
    }

    const order = await Order.findById(orderId);
    if(!order){
        return res.status(404).json({message:"order not found"});
    }
    if(order.status !== "available"){
        return res.status(400).json({message:"order is not available"});
    }
    order.status = "confirmed"
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
        latitude:deliveryPersonLoaction?.latitude,
        longitude:deliveryPersonLoaction?.longitude,
        address:deliveryPersonLoaction.address || ""
    },
    req.server.io.to(orderId).emit('orderconfirmed',order);
    awaitorder.save()
    return res.send(order)
    
} catch (error) {
    return res.status(500).json({message:"failed to confirm order"});
}
}

export const updateOrderStatus = async (req,res)=>{
    try {
      const {orderId} =  req.params;
      const {status,deliveryPersonLoaction} = req.body;
      const {userId} = req.user;

      const deliveryPerson = await DeliveryPartner.findById(userId);
      if(!deliveryPerson){
        return res.status(404).json({message:"Delivery person not found "});
      }
      const order = await Order.findById(orderId);
      
      if(!order){
      return res.status(404).json({message:"order not found"});
      }
      if (["cancelled","delivered"].includes(order.status)){
        return res.status(400).json({message:"order cannot be updated"});
      }
      if(order.deliveryPartner.toString() !== userId){
        return res.status(403).json({message:"unautorized "});
      }
      order.status = status;
      order.deliveryPersonLocation = deliveryPersonLoaction;
      await order.save();
      req.server.io.to(orderId).emit("liveTrackingUpdate",order);
      return res.send (order);
    } catch (error) {
      return res.status(500).json({message:"failed to update order status",error});  
    }
}

export const getOrders = async (req,res)=>{
    try {
       const {status,customerId , deliveryPartnerId, branchId} = req.query;
       let query = {};
       if(status){
        query.status = status;
       } 
       if(customerId){
        query.customer = customerId;
       }
       if(deliveryPartnerId){
        query.deliveryPartner = deliveryPartnerId;
        query.branch = branchId;

  }
  const orders = await Order.find(query).populate(
    "cuatomer branch items. item deliveryPartner"
  );
  return res.send(orders);
    } catch (error) {
        return res.status(500).json({message:"failed to retrieve order",error});
    }
}
// for get one order details change orders with order