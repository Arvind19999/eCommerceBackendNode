const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const Jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,"User Name is required"],
        maxLength : [15,"Name should not exceed 15 character"],
        minLength : [4,"Name should not be less than 4 character"]
    },
    email:{
        type : String,
        required : [true,"Email is required"],
        unique: true,
        validate :[validator.isEmail, "Please Enter Valid Email"],
    },
    password : {
        type : String,
        required : [true,"Password is required"],
        minLength : [5,"Password should be greater than 5 character"],
        secect : false
    },
    avatar:{
        public_id:{
            type : String,
            required : true
        },
        url :{
            type : String,
            required :true
        }
    },
    role : {
        type  :String,
        default  : "user"
    },
    
    resetPasswordToken: String,
    resatePasswordExpire : Date,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()  
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.getJwtToken = function(){
    return Jwt.sign({id : this._id},process.env.JWT_SECRETE,{
        expiresIn : process.env.JWT_EXPIRESIN
    })
}

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password)
}


userSchema.methods.resetPasswordTokens = function(){

    // ⁡⁢⁢⁢Generating token⁡
    const resetToken = crypto.randomBytes(20).toString("hex");

    // ⁡⁢⁢⁢Hashing and adding reset token to user schema⁡  
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resatePasswordExpire  = Date.now() + 15 * 60 * 1000;
    return resetToken
}
module.exports = mongoose.model("User",userSchema);