const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required :[true,"Please Enter Product Name"]
    },
    description:{
        type : String,
        required :[true,"Please Enter Product Description"]
    },
    price :{
        type : Number,
        required : true,
        maxLength : [8,"Product Price cannot be greater then 8 digit"]
    },
    rating : {
        type : Number,
        default : 0
    },
    image :[
{        public_id:{
            type : String,
            required : true
        },
        url:{
            type : String,
            required : true
        }
    }
    ],

    category  :{
        type : String,
        required:[true,"Please Enter Product Category"]
    },
    stock :{
        type : Number,
        required : [true,"Please Enter Product Stock"],
        maxLength : [4,"Stcok Cannot exceed than 4 characters"],
        default : 1
    },
    reviews : [{
        user  : {
            type : mongoose.Schema.ObjectId,
            ref : "User",
            required : true
        },
        name : {
            type : String,
            required : true
        },
        rating : {
            type : Number,
            required : true
        },
        comments : {
            type : String,
            required : true
        }
    }],
    numberOfReviews:{
        type : Number,
        default : 0
    },
    user  : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }

})


module.exports = mongoose.model("Product",productSchema);