const mongoose = require('mongoose');
const Notification = require('./notificationModel');
const User = require('./userModel');
const minIOIntegration = require('../minIOSetup/minIOConnection');
const minioClient = minIOIntegration.minioClient;
const fs = require('fs');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Post = mongoose.model('Post', postSchema);

module.exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find({ name: { $ne: req.firstname } })
      .sort({ createdAt: -1 })
      .exec();
    res.send(posts);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: 'User unauthenticated',
    });
  }
};

module.exports.createPost = async (req, res) => {
  const bucketName = 'linkedin';
  const file = req.file;

  try {
    let imageUrl = null;

    if (file) {
      const fileData = fs.readFileSync(file.path);
      const objectName = Date.now() + '-' + file.originalname;
      const metadata = { 'Content-type': 'image' };
      const v= await minioClient.putObject(bucketName, objectName, fileData, metadata);

      imageUrl = `http://localhost:9000/${bucketName}/${objectName}`; 
      console.log(objectName)
    }

    const newPost = new Post({
      name: req.firstname,
      content: req.body.content,
      imageUrl: imageUrl,
    });
    const result = await newPost.save();

    const otherUsers = await User.find({ name: { $ne: req.firstname } });
    const message = `${req.firstname} has created a new post.`;

    const notifications = otherUsers.map((otherUser) => ({
      userId: otherUser._id,
      postId: result._id,
      message,
    }));

    await Notification.insertMany(notifications);

    res.status(201).send({
      message: 'Post Created Successfully!',
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: 'User unauthenticated',
    });
  }
};

module.exports.getIndividualPost = async (req, res) => {
  try {
    const getIndpost = await Post.findById(req.params.id); 
    
    if (!getIndpost) {
      return res.status(404).send({
        message: 'Post not found',
      });
    }
    
    res.status(200).send(getIndpost);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};