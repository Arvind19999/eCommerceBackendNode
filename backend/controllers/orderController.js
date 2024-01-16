const Order = require("../models/orderModels");
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");


// ⁡⁢⁢⁢𝗰𝗿𝗲𝗮𝘁𝗲 𝗼𝗿𝗱𝗲𝗿⁡
exports.createOrder = catchAsyncError(async (req, res, next) => {
    const {shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id
    })
    res.status(201).json({
        success : true,
        message : "Order Placed Successfully",
        order : order
    })
});

// ⁡⁢⁢⁢𝗴𝗲𝘁 𝘀𝗶𝗻𝗴𝗹𝗲 𝗼𝗿𝗱𝗲𝗿⁡
exports.singleOrder = catchAsyncError(async (req, res, next) => {
        const order = await Order.findById(req.params.id).populate("user","name email");
        if (!order) {
            return next(new ErrorHandler("Order Not Found", 404));
        }

        res.status(200).json({
            success : true,
            order : order
        })
});

// ⁡⁢⁢⁢𝘃𝗶𝗲𝘄 𝗺𝘆 𝗼𝗿𝗱𝗲𝗿⁡  
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const myOrders = await Order.find({user : req.user._id});
    if(!myOrders){
        return next(new ErrorHandler("Order Not Found", 404));
    }
    res.status(200).json({
        success : true,
        order : myOrders
    })
});

// ⁡⁢⁢⁢𝗴𝗲𝘁 𝗔𝗹𝗹 𝗼𝗿𝗱𝗲𝗿𝘀 ⁡⁢⁢⁢--𝗔𝗱𝗺𝗶𝗻⁡⁡
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    if(!orders){
        return next(new ErrorHandler("Order Not Found", 404));
    }
    let totalAmount = 0;

    orders.forEach(item => {
        totalAmount +=item.totalPrice
    });
    res.status(200).json({
        success : true,
        order : orders,
        totalAmount : totalAmount
    })
});


// ⁡⁢⁢⁢𝘂𝗽𝗱𝗮𝘁𝗲 𝗢𝗿𝗱𝗲𝗿⁡ ⁡⁢⁢⁢--𝗔𝗱𝗺𝗶𝗻⁡
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

        
    if(!order){
        return next(new ErrorHandler("Order Not Found", 404));
    }

    if(order.orderStatus==="delivered"){
        return next(new ErrorHandler("Order has been already deliverd", 404));
    }

    order.orderItems.forEach(async(item)=>{
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus = req.body.status
    if(req.body.status==="delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave  :false})

    res.status(200).json({
        success : true,
        message : `order ${req.body.status} successfully`
    })
});

// ⁡⁢⁢⁢𝗽𝗿𝗼𝗱𝘂𝗰𝘁 𝘀𝘁𝗼𝗰𝗸 𝘂𝗽𝗱𝗮𝘁𝗲 𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻⁡
async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock -= quantity
    await product.save({validateBeforeSave:false})
}

// ⁡⁢⁢⁢𝗼𝗿𝗱𝗲𝗿 𝗗𝗲𝗹𝗲𝘁𝗲 --𝗔𝗱𝗺𝗶𝗻⁡
exports.orderDelete = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("Order Not Found", 404));
    }

    await order.remove();
    
    res.status(200).json({
        success : true,
        message : "Order has been removed successfully"
    })
});