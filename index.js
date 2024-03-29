const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const session=require('express-session');
const path = require('path');
const MongoDBSession=require('connect-mongodb-session')(session)
const User = require('./models/user');
const cors = require('cors'); // Import the cors module
const app = express();
const port = 5000;
const isAuth = require('./middleware/verifyUser'); // Import the middleware

app.use(express.json());

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'views')));


const mongoURI = "mongodb+srv://vamsi:Vamsi95@cluster0.js2dojf.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI,)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Error connecting to MongoDB:", error));

const store=new MongoDBSession({
  uri:mongoURI,
  collection:"mySessions",
})

app.use(
  session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    store: store,
  })
)

app.get("/",(req,res)=>{
   res.render("landing")
})
app.get("/login",(req,res)=>{
  res.render("login");
})
app.get("/register",(req,res)=>{
  res.render("register");
})
app.get("/home",(req,res)=>{
  res.render("home")
})
app.get("/profile",isAuth,async(req,res)=>{
  res.render("profile", { username: req.user.username, email: req.user.email });
})

app.post("/register",async (req,res)=>{
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }  

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.redirect("/login")
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }

})

app.post("/login",async(req,res)=>{
    try {
      // Extract user credentials from request body
      const { email, password } = req.body;
  
      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      req.session.isAuth=true
      req.session.user = { username: user.username, email: user.email };
      res.redirect("/home")
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  
})

app.post('/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/login")
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
