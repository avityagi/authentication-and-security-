//jshint esversion:6
require('dotenv').config();
const express =require("express");
const bodyParser =require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const app =express();
const encrypt = require("mongoose-encryption")
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"] });
const User = new mongoose.model("User",userSchema);
app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB");
app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});
app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const email=req.body.username;
  const password=req.body.password;
  User.findOne({email:email},function(err,result){
    if(result.password===password)
    {
      res.render("secrets");
    }
  })
});
app.listen(3000,function(){
  console.log("Server started on port 3000.");
});
