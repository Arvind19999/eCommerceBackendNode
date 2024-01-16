const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Apifeatures = require("../utils/apiFeatures");

// ⁡⁢⁢⁢𝗖𝗿𝗲𝗮𝘁𝗲 𝗣𝗿𝗼𝗱𝘂𝗰𝘁 --𝗔𝗱𝗺𝗶𝗻⁡
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        product: product,
    });
});

// ⁡⁢⁢⁢𝘂𝗽𝗱𝗮𝘁𝗲 𝗣𝗿𝗼𝗱𝘂𝗰𝘁 --𝗔𝗱𝗺𝗶𝗻⁡
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    // const findProd = awa
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(201).json({
        success: true,
        message: "Product Updated Successfully",
        product: product,
    });
});

// ⁡⁢⁢⁢𝗴𝗲𝘁 𝗔𝗹𝗹 𝗣𝗿𝗼𝗱𝘂𝗰𝘁𝘀⁡
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const itemsPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new Apifeatures(Product, req.query).search().filter().pagination(itemsPerPage);
    // const products = await Product.find();
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products: products,
        totalProduct  :productCount
    });
});

// ⁡⁢⁢⁢𝗚𝗲𝘁 𝗦𝗶𝗻𝗴𝗹𝗲 𝗣𝗿𝗼𝗱𝘂𝗰𝘁⁡
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product: product,
    });
});

// ⁡⁢⁢⁢𝗗𝗲𝗹𝗲𝘁𝗲 𝗣𝗿𝗼𝗱𝘂𝗰𝘁⁡
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
});


// ⁡⁢⁢⁢𝗖𝗿𝗲𝗮𝘁𝗲 𝗮𝗻𝗱 𝘂𝗽𝗱𝗮𝘁𝗲 𝗥𝗲𝘃𝗶𝗲𝘄𝘀⁡
exports.reviewCreateUpdate = catchAsyncError(async (req, res, next) => {
    const {rating , comments, productId}= req.body;
    const reviews = {
        user : req.user._id,
        name : req.user.name,
        comments  : comments,
        rating  : Number(rating)
    } 

    const product = await Product.findById(productId);

    const existingReviewIndex = product.reviews.findIndex(rev => rev.user.toString() === req.user._id.toString());

    if (existingReviewIndex !== -1) {
        // Update existing review
        product.reviews[existingReviewIndex].comments = comments;
        product.reviews[existingReviewIndex].rating = rating;
    } else {
        // Add new review
        product.reviews.push(reviews);
        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev=>{
            avg += rev.rating
    })
    product.rating = avg/product.reviews.length 

    await product.save({validateBeforeSave : false});
    res.status(200).json({
        success : true,
        message  :"Review completed Successfully"
    })
});


// ⁡⁢⁢⁢𝗴𝗲𝘁 𝗔𝗹𝗹 𝗥𝗲𝘃𝗶𝗲𝘄𝘀⁡
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const id = req.query.id
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        productReviews: product.reviews
    });
});

// ⁡⁢⁢⁢𝗱𝗲𝗹𝗲𝘁𝗲 𝗥𝗲𝘃𝗶𝗲𝘄𝘀  ⁡
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const productId = req.query.productId
    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }
    const reviews = product.reviews.filter(rev=>rev._id.toString() !==req.query.id.toString());
    let avg = 0;
    reviews.forEach(rev=>{
            avg += rev.rating
    })
    rating = avg/reviews.length 
    const numberOfReviews = reviews.length;
    await Product.findByIdAndUpdate(productId,{
        reviews,
        rating,
        numberOfReviews,
    },{
        new : true,
        runValidators : true,
        useFindAndModify  :false
    })
    res.status(200).json({
        success: true,
        message : "Product review deleted Successfully"
    });
});


