const dotenv=require("dotenv");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
  process.env.CREDENTIALS +"/<dbname>?retryWrites=true&w=majority",
).
catch(error => console.log(error));
  
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

app.post("/", function (req, res) {
  let item = Object.keys(req.body)[0];
  res.redirect("/" + item);
});
