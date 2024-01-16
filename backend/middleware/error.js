const ErrorHandler = require("../utils/errorHandler")


module.exports = (err,req,res,next)=>{
        err.message = err.message || "Internal Server Error"
        err.statusCode = err.statusCode || 500


        // ⁡⁢⁢⁢𝗪𝗿𝗼𝗻𝗴 𝗠𝗼𝗻𝗴𝗼𝗗𝗯 𝗜𝗱 𝗲𝗿𝗿𝗼𝗿⁡ 
        if(err.name = "CastError"){
            const message = `Invalid ${err.message}`
            // const message = `Login to access this feature`
            err = new ErrorHandler(message, 400)
        }
       
        // ⁡⁢⁢⁢𝗝𝘀𝗼𝗻𝗪𝗲𝗯𝗧𝗼𝗸𝗲𝗻 𝗲𝗿𝗿𝗼𝗿⁡
        // if(err.name = "JsonWebTokenError"){
        //     const message = `Json Web Token is invalid, Try Again`
        //     err = new ErrorHandler(message, 400)
        // }

        // ⁡⁢⁢⁢𝗝𝗪𝗧 𝗘𝘅𝗽𝗶𝗿𝗲 𝗘𝗿𝗿𝗼𝗿⁡
        // if(err.name = "TokenExpiredError"){
        //     const message = `JWT is Expired, Try Again`
        //     err= new ErrorHandler(message, 400)
        // }

        res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
}