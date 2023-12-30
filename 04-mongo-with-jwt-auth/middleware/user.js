const { decode } = require("punycode");
const JWT_SECRET = require("../config");
const secret = require("../config");

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; //user contain decoded jwt and setting it in req body
        
        next();
    });
    //try and catch is removed due to errro parament in call back
    try {
        const decoded = jwt.verify(token ,JWT_SECRET);
        if(decoded.username){
            req.username = decoded.username
            next();
        }else{
            res.status(403).json({
                msg : "You are not authenticated"
            })
        }
    }catch(error){
        res.status(500).json({msg : "invalid username"})
    }

}

module.exports = userMiddleware;