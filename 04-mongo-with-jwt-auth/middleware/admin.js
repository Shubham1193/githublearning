// Middleware for handling auth
const jwt = require('jsonwebtoken');
// const secret = require("../index"); //error circular dependency both file importing each other
const secret = require("../config");


function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    // try{
    //     const authHeader = req.headers['authorization'];
    //     const token = authHeader && authHeader.split(' ')[1];
    //     jwt.verify(token , jwtPassword);
    //     next();
    // }catch(error){
    //     res.json({message : "unauthorized user"})
    // }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
    // authintication vs authorization 
    // all users and admin seperate .. check type of user
    // jwt save databases call 
    // const decoded = jwt.verify(token,secret)
    // if(decoded.username){
    //     next()
    // }else{
    //     res.status(403).json({
    //         msg : "You are not authenticated"
    //     })
    // }
}

module.exports = adminMiddleware;