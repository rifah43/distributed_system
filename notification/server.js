const mongoose= require("mongoose");
const express= require("express");
const cors= require("cors");
const cookieParser= require("cookie-parser");
const bodyParser = require("body-parser");
const cleanNotificationJob= require('./cleanNotificationJob.js');

const url= "mongodb://127.0.0.1:27017/linkedin-notification";
const port= 9200;
const app= express();

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    cleanNotificationJob();
    app.listen(port, function check(err) {
      if (err)
        console.log("error");
      else
        console.log("Notification server connected");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({limit: "4mb"}));

const notifRoutes = require('./notificationRoute.js');
app.use(notifRoutes);