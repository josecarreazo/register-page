const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
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
