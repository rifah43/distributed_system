const {Router}= require('express');
const User= require('../models/userModel');
const Post= require('../models/postModel');
const Notification= require('../models/notificationModel');
const router= Router();
const authMiddleware= require('../middleware/authMiddleware');

router.post("/user/register", async(req,res)=>{
    User.registration(req,res);
});

router.post("/user/login", async(req,res)=>{
    User.login(req,res);
});

router.get("/user/post",authMiddleware.authenticate, async (req, res) => {
    Post.getPost(req,res);
});

router.post("/user/post",authMiddleware.authenticate, async (req, res) => {
    Post.createPost(req,res);
});

router.get('/user/post/:id',authMiddleware.authenticate, async (req, res) => {
    Post.getIndividualPost(req,res);
});

router.get("/user/notification",authMiddleware.authenticate, async (req, res) => {
    Notification.getNotification(req,res);
});

router.delete('/user/notification/:id',authMiddleware.authenticate, async (req, res) => {
    Notification.deleteNotification(req,res);
});

module.exports= router;