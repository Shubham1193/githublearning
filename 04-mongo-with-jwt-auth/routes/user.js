const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwtPassword = 'secret';
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const {username , password} = req.body;
    try{
        const user = await User.create({
            username : username,
            password : password 
        })
    }catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    const {username , password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.json({message : "User not found"})
        }
        const isValidPass = password == user.password;
        if(!isValidPass){
            return res.json({message : "Wrong Password"})
        }
        const token = jwt.sign({username , password} , jwtPassword);
        res.json({token : token})
    }catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }

});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try{
        const courses = Course.find({});
        if(!courses){
            return res.json("No Courses");
        }
        res.json({courses})
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
    }
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    try{
        const user = User.findOneAndUpdate({username:req.user.username},
            {$addToSet : {purchasedCourses : courseId }},
            {new : true});
        res.json({message : "Course purchased successfully"})
    }catch(error){
        console.log(error);
        res.json({message : "Internal Server Error"});
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try{
        const user = User.findOne({username : req.user.username});
        await user.populate("purchasedCourses");
        const course = user.purchasedCourses;
        res.json({courses : course})
    }catch(error){
        console.log(error);
        res.json({message : "Internal Server Error"});
    }
});

module.exports = router