const {User} = require("../db")

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const username = req.headers["username"];
    const password = req.headers["password"];
    
    const admin = await User.findOne({username});
    if(!admin){
        return res.status(404).json({
            error : "unauthorized"
        })
    }

    const isValidPassword = admin.password == password;
    if(!isValidPassword){
        return res.status(401).json({erro : "unauthorized"});
    }
    // Attach the username to the req object
    req.username = username;
    next();

}

module.exports = userMiddleware;