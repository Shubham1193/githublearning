// Middleware for handling auth
// import {Admin} from "../db";
const { Admin } = require("../db");


async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers["username"];
    const password = req.headers["password"];
    
    const admin = await Admin.findOne({username});
    if(!admin){
        return res.status(404).json({
            error : "unauthorized"
        })
    }
    //admin = {username:shunham,password:12345};


    const isValidPassword = admin.password == password;
    if(!isValidPassword){
        return res.status(401).json({erro : "unauthorized"});//early return
    }

    next();

    

}

module.exports = adminMiddleware;