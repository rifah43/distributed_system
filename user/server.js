const mongoose= require("mongoose");
const express= require("express");
const cors= require("cors");
const cookieParser= require("cookie-parser");
const bodyParser = require("body-parser");

const url= "mongodb://127.0.0.1:27017/linkedin-user";
const port= 9300;
const app= express();

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    app.listen(port, function check(err) {
      if (err)
        console.log("error");
      else
        console.log("User server connected");
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

const userRoutes = require('./userRoutes.js');
app.use(userRoutes);