const {Router}= require('express');
const router= Router();
const authenticateJWT = require('./authMiddleware.js')
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

router.get("/post",authenticateJWT.authenticate, async (req, res) => {
  Post.getPost(req,res);
});

router.post('/post', authenticateJWT.authenticate, upload.single('image'), async (req, res) =>{
  Post.makePost(req,res);
});

router.get('/post/:id',authenticateJWT.authenticate, async (req, res) => {
  Post.getIndividualPost(req,res);
});
module.exports= router;
