const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


exports.isAuthenticatedUser = catchAsyncErrors( async(req, res, next)=>{
    console.log("1")
    console.log(req.cookies)
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHander("Please login to access the resource", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
})

exports.authorizeRoles = (...roles) =>{
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next (new ErrorHander(
                `Role ${req.user.role} is not allowed to access this resource`, 403
            ))
        };
        next();
    }
};