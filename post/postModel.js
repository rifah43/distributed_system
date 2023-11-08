const mongoose = require('mongoose');
const minIOIntegration = require('./minIOSetup/minIOConnection.js');
const minioClient = minIOIntegration.minioClient;
const fs = require('fs');
const axios = require('axios');
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

module.exports.getPost= async (req, res) => {
  try {
    const posts = await Post.find({ name: { $ne: req.firstname } })
      .sort({ createdAt: -1 })
      .exec();
    res.send(posts);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: 'No posts',
    });
  }
};

module.exports.makePost = async (req, res) => {
  const bucketName = 'linkedin';
  const file = req.file;
  
  try {
    let imageUrl = null;

    if (file) {
      const fileData = fs.readFileSync(file.path);
      const objectName = Date.now() + '-' + file.originalname;
      const metadata = { 'Content-type': 'image' };
      const minioResponse = await minioClient.putObject(bucketName, objectName, fileData, metadata);

      imageUrl = `http://minio:9000/${bucketName}/${objectName}`;
    }

    const newPostData = new Post({
      name: req.firstname,
      content: req.body.content,
      imageUrl: imageUrl,
    });
    const result = await newPostData.save();
    const userApiUrl = "http://user:3001/user";
    const notifApiUrl = "http://notification:3003/notification";

    const otherUsers = await axios.get(`${userApiUrl}/create-post`, );
    console.log(otherUsers);
    
    const message = `${req.firstname} has created a new post.`;
    const notifications = otherUsers.map((otherUser) => ({
      userId: otherUser._id,
      postId: result._id, 
      message: message
    }));

    await axios.post(`${notifApiUrl}/get-notifications`, notifications);

    res.status(201).send({
      message: 'Post Created Successfully!',
    });
  } catch (err) {
     console.error(err);
     return res.status(401).send({
       message: 'User unauthenticated',
     });
   }
};

module.exports.getIndividualPost= async (req, res) => {
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

module.exports.Post= this.Post;