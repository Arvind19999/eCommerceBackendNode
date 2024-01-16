const crypto = require("crypto")
const bcrypt = require("bcryptjs")

const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const generateSetCookie = require("../utils/tokens")
const sendEmail = require("../utils/sendEmail")


// ⁡⁢⁢⁢𝗥𝗲𝗴𝗶𝘀𝘁𝗲𝗿⁡
exports.userRegister = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return next(new ErrorHandler("Email Already Exist", 400));
    }
    const newUser = await User.create({
        name: name,
        email: email.toLowerCase(),
        password: password,
        avatar: {
            public_id: "profilImg",
            url: "https://previews.123rf.com/images/triken/triken1608/triken160800029/61320775-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration.jpg"
        }
    })
    generateSetCookie(newUser, 201, "User Created Successfully", res)
});


// ⁡⁢⁢⁢𝗟𝗼𝗶𝗴𝗻⁡
exports.userLogin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Enter Email or Password", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    generateSetCookie(user, 200, "User LoggedIn Successfully", res)
});


// ⁡⁢⁢⁢𝗨𝘀𝗲𝗿 𝗟𝗼𝗴𝗴𝗲𝗱 𝗢𝘂𝘁⁡
exports.userLoggedOut = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expiresIn: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "User Logged Out Successfully"
    })
});

// ⁡⁢⁢⁢𝗨𝘀𝗲𝗿 𝗙𝗼𝗿𝗴𝗲𝘁 ⁡⁢⁢⁢𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱⁡   ⁡
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
        return next(new ErrorHandler("User Not Found ", 404))
    }

    const resetToken = user.resetPasswordTokens()
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`
    const message = `Click Here to Reset Your Password:- ${resetPasswordUrl}\n\n If you have not requested this email then please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email Sent successfully to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resatePasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})



// ⁡⁢⁢⁢𝗥𝗲𝘀𝗲𝘁 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱  ⁡
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resatePasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
        return next(new ErrorHandler("Reset Password token is invalid or has beeb expire", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and Confirm Password Mismatched", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resatePasswordExpire = undefined;
    await user.save();
    generateSetCookie(user, 200, "Password Changed Successfully", res)
})


// ⁡⁢⁢⁢𝗚𝗲𝘁 𝘂𝘀𝗲𝗿 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗱𝗲𝘁𝗮𝗶𝗹𝘀⁡
exports.getUserProfile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success : true,
        user : user
    })
})


// ⁡⁢⁢⁢𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱 𝗨𝗽𝗱𝗮𝘁𝗲⁡
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

   
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler("Old Password MisMatched", 400));
    }

    if(req.body.newPassowrd !== req.body.confirmPassword){
        return next(new ErrorHandler("New Pasword and Confirm New Password MisMatched", 401));
    }


    user.password = req.body.newPassowrd;
    await user.save();
    generateSetCookie(user, 200, "Password Updated Successfully", res)
})


// ⁡⁢⁢⁢𝗨𝗽𝗱𝗮𝘁𝗲 𝗣𝗿𝗼𝗳𝗶𝗹𝗲⁡
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData  = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
            new : true,
            runValidators  :true,
            useFindAndModify : false
    })

res.status(200).json({
    success : true,
    message : "Profile Updated Successfully"
})
})

//⁡ ⁢⁢⁢𝗚𝗲𝘁 𝗔𝗹𝗹 𝘂𝘀𝗲𝗿𝘀 𝗯𝘆 𝗮𝗱𝗺𝗶𝗻⁡  
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return next(new ErrorHandler("No users", 200));
    }
    res.status(200).json({
        success : true,
        message : "All users detail",
        users : users
    })
})

// ⁡⁢⁢⁢𝗚𝗲𝘁 𝗦𝗶𝗻𝗴𝗲𝗹 𝗨𝘀𝗲𝗿 𝗯𝘆 𝗮𝗱𝗺𝗶𝗻⁡
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }
    res.status(200).json({
        success : true,
        message : "User details",
        user : user
    })
})


// ⁡⁢⁢⁢𝗨𝗽𝗱𝗮𝘁𝗲 𝗥𝗼𝗹𝗲 𝗯𝘆 𝗮𝗱𝗺𝗶𝗻 ⁡
exports.updateRole = catchAsyncError(async (req, res, next) => {
    const newUserData  = {
        name : req.body.name,
        email : req.body.email,
        role  : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
            new : true,
            runValidators  :true,
            useFindAndModify : false
    })

res.status(200).json({
    success : true,
    message : "Role Update Successfully"
})
})


// ⁡⁢⁢⁢𝗗𝗲𝗹𝗲𝘁𝗲 𝗨𝘀𝗲𝗿⁡
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User Not Found ", 404))
    }

    await user.remove()
res.status(200).json({
    success : true,
    message : "User Deleted Successfully"
})
})