const { Router } = require("express");
const router = Router();
const { User} = require("../db");
const { Course } = require("../db");
const userMiddleware = require("../middleware/user");

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  User.create({
    username: req.body.username,
    password: req.body.password,
  });
  res.json({
    message: "User created successfully",
  });
});

router.get("/courses", (req, res) => {
  // Implement listing all courses logic
  Course.find().then(sendAllcourse);
  function sendAllcourse(data) {
    res.json(data);
  }
  // });
  // Yes, the array update operators, such as $addToSet, $push, $pop, $pull, $pullAll, $each, $slice, and others, are specifically designed to work with arrays in MongoDB documents. These operators provide a way to modify the content of array fields in documents.

  // If you're dealing with other types of fields or want to perform general updates to non-array fields, you can use other update operators like $set, $unset, $inc, $mul, etc., which work for updating scalar values.

  // Here's a brief overview of some commonly used non-arr
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers["username"];
  

//   User.findOneAndUpdate(
//     { username: username },
//     { $addToSet: { purchasedCourses: courseId } },
//     { new: true }
//   ).then((user) => {
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "Course purchased successfully" });
//   });
    try {
  const user = await User.findOneAndUpdate(
    { username: username },
    { $addToSet: { purchasedCourses: courseId } },
    { new: true }
  );

  // if (!user) { // useless because we reached here after middleware
  //   return res.status(404).json({ message: 'User not found' });
  // }

  res.json({ message: 'Course purchased successfully' });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
}

});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.headers["username"];//   
  // const username = req.username //from requet attached by middleware
  User.findOne({ username: username })
    .populate("purchasedCourses")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.purchasedCourses);
    });
    // Example: In the URL /search?q=term&page=1, q and page are query parameters, and their values are term and 1, respectively.

//     that are replaced by actual values when a request is made.
// Example: In the URL pattern /users/:userId, :userId is a path parameter, and it can be replaced with an actual user ID when making a request (e.g., /users/123).
    // try{
    //     const user = await User.findOne({username : username});
    //     await user.populate("purchasedCourse");
    //     const populatedCourse = user.purchasedCourses;
    //     res.json(populatedCourse)
    // }catch(error){
    //     console.log(error);
    //     res.status(500).json({message:'Internal Server Error'})
    // }

});

module.exports = router;
