const { hash } = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

// const  createOrder = (newOrder) => {
//     return new Promise( async(resolve, reject)=> {
//         const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email} = newOrder
//         try{
//             const promise = orderItems.map( async(order) =>{
//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         countInStock: {$gte: order.amount}
//                     },
//                     {$inc: {
//                         countInStock: -order.amount,
//                         selled: +order.amount
//                     }},
//                     {new: true}
//                  ) 
//                  if(productData){
//                     const createdOrder = await Order.create({
//                         orderItems,
//                         shippingAddress: {
//                             fullName,
//                             address,
//                             city, phone
//                         },
//                         paymentMethod,
//                         itemsPrice,
//                         shippingPrice,
//                         totalPrice,
//                         user: user,
//                         isPaid,
//                         paidAt
//                     })
//                     if(createdOrder){         
//                         await EmailService.sendEmailCreateOrder(email, orderItems)
//                         return {
//                             status: 'OK', 
//                             message: 'SUCCESS',
//                         }
//                     }
//                  } else {
//                     return {
//                         status: 'OK', 
//                         message: 'ERR',
//                         id: order.product
//                     }
//                  }
//             })
//             const results = await Promise.all(promise)   
//             const newData = results && results.filter((item) => item.id)
//             if(newData.length){
//                 resolve({
//                     status: 'ERR',
//                     message: `Sản phẩm với id${newData.join,(',')} không đủ hàng`
//                 })
//             }
//             resolve({
//                 status: 'OK',
//                 message: 'success'
//             })
//         }catch(e){
//             reject(e)
//         }
//     })
// }

// const  createOrder = (newOrder) => {
//     return new Promise( async(resolve, reject)=> {
//         const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email} = newOrder
//         try{
//             const promises = orderItems.map( async(order) =>{
//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         countInStock: {$gte: order.amount}
//                     },
//                     {$inc: {
//                         countInStock: -order.amount,
//                         selled: +order.amount
//                     }},
//                     {new: true}
//                  ) 
//                  if(productData){
//                     return {
//                         status: 'OK',
//                         message: 'Success'
//                     }
                    
//                  } else {
//                     return {
//                         status: 'OK', 
//                         message: 'ERR',
//                         id: order.product
//                     }
//                  }
//             })
//             const results = await Promise.all(promises)   
//             const newData = results && results.filter((item) => item.id)
//             if(newData.length){
//                 const arrId = []
//                 newData.forEach((item) => {
//                     arrId.push(item.id)
//                 })
//                 resolve({
//                     status: 'ERR',
//                     message: `Sản phẩm với id: ${arrId.join,(',')} không đủ hàng`
//                 })
//             } else{
//                 const createdOrder = await Order.create({
//                         orderItems,
//                         shippingAddress: {
//                             fullName,
//                             address,
//                             city, phone
//                         },
//                         paymentMethod,
//                         itemsPrice,
//                         shippingPrice,
//                         totalPrice,
//                         user: user,
//                         isPaid,
//                         paidAt
//                     })
//                     if(createdOrder){         
//                         await EmailService.sendEmailCreateOrder(email, orderItems)
//                         resolve ({
//                             status: 'OK', 
//                             message: 'success',
//                         })
//                     }
//             }  
//         }catch(e){
//             reject(e)
//         }
//     })
// }



const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: order.amount
                        }
                    },
                    { new: true }
                );
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    };
                } else {
                    return {
                        status: 'ERR',
                        message: 'ERR',
                        id: order.product
                    };
                }
            });

            const results = await Promise.all(promises);
            const failedItems = results.filter((item) => item.status === 'ERR');

            if (failedItems.length) {
                const arrId = failedItems.map(item => item.id);
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${arrId.join(', ')} không đủ hàng`
                });
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid,
                    paidAt
                });

                if (createdOrder) {
                    try {
                        await EmailService.sendEmailCreateOrder(email, orderItems);
                        resolve({
                            status: 'OK',
                            message: 'success',
                        });
                    } catch (emailError) {
                        // Xử lý lỗi khi gửi email, nếu cần
                        console.error('Error sending email:', emailError);
                        resolve({
                            status: 'OK',
                            message: 'Order created but failed to send email'
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}


const getAllOrderDetails = (id) => {
    return new Promise( async(resolve, reject)=> {
        try{
            const order = await Order.find({
                user: id
            })
            
            if(order === null){
                resolve({
                    status: 'OK', 
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch(e){
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise( async(resolve, reject)=> {
        try{
            const order = await Order.findById({
                _id: id
            })
            
            if(order === null){
                resolve({
                    status: 'OK', 
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch(e){
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise( async(resolve, reject)=> {
        try{
            let order = []
            const promises = data.map( async(order) =>{
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }},
                    {new: true}
                 ) 
                 if(productData){
                    order = await Order.findByIdAndDelete(id)
                    if(order === null){
                        resolve({
                            status: 'ERR', 
                            message: 'The order is not defined'
                        })
                    }
                 } else {
                    return {
                        status: 'OK', 
                        message: 'ERR',
                        id: order.product
                    }
                 }
            })
            const results = await Promise.all(promises)   
            const newData = results && results.filter((item) => item)
            if(newData.length){
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id${newData.join,(',')} không tồn tại`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch(e){
            reject(e)
        }
    })
}

const getAllOrder = (id) => {
    return new Promise( async(resolve, reject)=> {
        try{
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
    
}
