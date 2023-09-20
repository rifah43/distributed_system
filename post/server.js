const mongoose= require("mongoose");
const express= require("express");
const cors= require("cors");
const bodyParser = require("body-parser");

const url= "mongodb://mongodb-service2:27017/linkedin-post";
const port= 3002;
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
        console.log("Post server connected");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json({limit: "4mb"}));

const postRoutes = require('./postRoutes.js');
app.use(postRoutes);