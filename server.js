const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const firebase = require("firebase/app");
require("firebase/database");
require("firebase/storage");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const Cryptr = require("cryptr");

const port = process.env.PORT || 5000;
const app = express();

app.use(morgan("combined"));
let transporter;

const initializeTransporter = () => {
  transporter = nodemailer.createTransport({
    service: "Godaddy",
    secure: false,
    port: 587,
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      throw new Error("Tranporter validation failed");
    } else {
      console.log("server is ready to send message");
    }
  });
};

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

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
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("****** initlialize fire base database *****");
  } else {
    firebase.app(); // if already initialized, use that one
  }
};
initializeFirebase();

app.post("/saveDetails", (req, res) => {
  if (!req.body) {
    return;
  }
  firebase
    .database()
    .ref("/saveDetail/" + req.body.id)
    .set(req.body)
    .catch((err) => {
      res.status(500).send(`Something went wrong`);
    });
  res.status(200).send("Data has been saved suucessfully.");
});

const createMailTemplate = (body) => {
  const { title, description } = body;
  return `
    <h1>${title}</h1>
    <div>
    <p>${description}</p>
    </div>
    <img src="cid:image"/>
  `;
};

const sendEmail = (req) => {
  const mailTemplate = createMailTemplate(req.body);
  const { url } = req.body;
  transporter
    .sendMail({
      from: '"MMT-TOD 👻" <ankur@kumarankur.in>',
      to: "ankur@kumarankur.in, akakankur81@gmail.com, omvikram@gmail.com",
      subject: "Term of day✔",
      html: mailTemplate,
      attachments: [
        {
          filename: "image.png",
          path: url,
          cid: "image",
        },
      ],
    })
    .then((res) => {
      console.log("mail send successfully");
    })
    .catch((err) => {
      throw new Error("Failed to send email");
    });
};

app.post("/sendEmail", async (req, res) => {
  try {
    await sendEmail(req);
    res.status(200).send("mail has been send successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
  initializeTransporter();
});
