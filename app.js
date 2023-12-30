const express = require("express");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:Shubham1173@cluster0.8uttq.mongodb.net/todoApp');

const app = express();

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: {
      type: Boolean,
      default: false,
    },
  });
  
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos: [TodoSchema], 
});

const User = mongoose.model('User',UserSchema);

app.use(express.json())

app.post("/signup" ,async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    try{
        const user = await User.create({
            username,
            password
        })
        res.json({message : "user created successfully"})
    }catch(error){
        console.log(error)
        res.json(500).json({message:"Server is Fucked Up"});
    }
})


app.post("/signin" , async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    try { 
        const user = await User.findOne({
            username,
            password
        })
        if(!user){
            return res.status(403).json({msg : "User not found"})
        }
        const token = jwt.sign({username , password} , "fuck me");
        res.json({message : token})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg : "Server Fucked Up"})
    }
})

app.post("/createCourse", async function(req,res){
    const username = req.headers.username;
    const {title , description} = req.body;
    try {
        const  user = await User.findOneAndUpdate({username : username}, { $push: { todos: [{ title: title, description: description }] } },{new : true});
        res.json({user});
    }catch(error){
        res.status(500).json({message : "Server Fucked Up"});
    }
})

app.delete("/delete/:todoid" ,async function(req,res){
    const username = req.headers.username;
    const todoid = req.params.todoid;
    try{
        const user = await User.findOneAndUpdate({username : username} , {$pull : {todos : { _id : todoid }}},{new : true});
        res.json({msg : user})

    }catch(error){
        console.log(error);
        res.status(500).json("Server fucked up")
    }
})



app.put("/done/:todoid", async function(req, res) {
    const username = req.headers.username;
    const todoid = req.params.todoid;

    try {
        // Find the user by username and update the todos array
        const user = await User.findOneAndUpdate(
            { username: username, "todos._id": todoid },
            { $set: { "todos.$.completed": true } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Todo completed successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


app.listen(3000);
