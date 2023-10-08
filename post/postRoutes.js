const {Router}= require('express');
const router= Router();
const authMiddleware= require('./authMiddleware.js');
const Post= require('./postModel.js');
const multer = require('multer');

const PATH = './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get("/post",authMiddleware.authenticate, async (req, res) => {
  Post.getPost(req,res);
});

router.post('/post', authMiddleware.authenticate, upload.single('image'), async (req, res) =>{
  Post.makePost(req,res);
});

router.get('/post/:id',authMiddleware.authenticate, async (req, res) => {
  Post.getIndividualPost(req,res);
});
module.exports= router;
