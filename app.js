const dotenv = require("dotenv");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");

dotenv.config();
const app = express();
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(
    process.env.CREDENTIALS + "/<passportdB>?retryWrites=true&w=majority"
  )
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Listed at Port 3000");
});

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/main",function(req,res){
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/login");
  }
})

app.post("/", function (req, res) {
  let item = Object.keys(req.body)[0];
  res.redirect("/" + item);
});

app.post("/register", function (req, res) {
  User.register(
    {
      username: req.body.username,
      email: req.body.email,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.post("/login", function (req, res) {

  const user= new User({
      username:req.body.username,
      password:req.body.password
  })

  req.login(user, function(error){
      if(error){
          console.log(error);
          res.redirect("login")
      }else{
          passport.authenticate("local")(req, res, function () {
              res.redirect("/main");
            });
      }
  })

});

app.post("/main", function(req,res){
  req.logout();
  res.redirect('/');
})