require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// View engine setup
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact", { layout: false });
});

app.post("/send", (req, res) => {
  const output = `
   <p>You have a new contact request</p>
   <h3>Contact Details</h3>
   <ul>
      <li>Name : ${req.body.name}</li>
      <li>Company : ${req.body.company}</li>
      <li>Email : ${req.body.email}</li>
      <li>Phone : ${req.body.phone}</li>
   </ul>
   <h3>Message</h3>
   <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: '"Nodemailer Contact" <k.kumarmohit19@gmail.com>', // sender address
    to: "k.kumarmohit19@gmail.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message send: %s", info.messageId);
    console.log("Private URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { layout: false, msg: "Email has been sent" });
  });
});

app.listen(3000, () => {
  console.log("Server started...");
});
