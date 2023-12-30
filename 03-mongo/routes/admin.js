const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin } = require("../db");
const express = require("express");
const { Course } = require("../db")
const router = Router();

const app = express();
app.use(express.json());



// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    try {
        const admin = await Admin.create({
            username : req.body.username,
            password : req.body.password
        })
        res.json({message : "Admin created successfully"})
    }catch(error){
        console.log(error);
        res.status(500).json({error : 'Internal Server Error'})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const {title , description , price , imageLink} = req.body;

    try{
        const newCourse = await Course.create({
            title : title,
            description : description,
            price : price,
            imageLink : imageLink
        })
        res.json({message : 'Course created successfully', courseId : newCourse._id})
    }catch(error){
        console.log(error);
        res.status(500).json({error : 'Internal Server Error'})
    }

});

router.get('/courses', adminMiddleware,async function(req, res) {
    try{
        const courses = await Course.find({},{_id:1,title:1,description:1,purchased : 1 , imageLink:1 , published:1})
        res.json({courses})
    }catch(error){
        console.log(error);
        res.status(500).json({error : 'Internal Server Error'})
    }

});



// router.get('/courses', adminMiddleware, (req, res) => {
//     // Implement fetching all courses logic
//     Course.find().then(courses => {
//         res.json(courses);
//     })

// });

module.exports = router;