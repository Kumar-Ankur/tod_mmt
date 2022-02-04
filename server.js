const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const firebase = require("firebase/app");
require("firebase/database");
const nodemailer = require("nodemailer");
const firebaseConfig = require("./src/firebaseConfig");

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.use(express.static(path.join(__dirname, "public")));

//cross origin resource sharing access permission attached in Header section

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type, Authorization, Cache-Control");
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

app.get("/", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

const initializeFirebase = () => {
  console.log("initlialize fire base database", firebase.apps.length, !firebase.apps.length);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
};
initializeFirebase();

app.post("/todDetails", (req, res) => {
  const body = JSON.parse(req.body)
  console.log(req.body,body);
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
