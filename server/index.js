const express = require('express');
const app = express();
const mongoose = require('mongoose');
const USER = require('./models/User');
const Post = require('./models/Post');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');
require('dotenv').config()
const port = process.env.PORT ;

const salt = bcrypt.genSaltSync(10);


app.use(cors({
    origin: "https://blog-app-client-eight.vercel.app",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect("mongodb+srv://admin:admin@blogapp.t1v4cky.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=blogapp");

app.get("/",(req,res)=>{
      res.json("hello");

})

app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      try {
            const userDoc = await USER.create({
                  username,
                  password: bcrypt.hashSync(password, salt) 
            });
            res.json(userDoc);
      }
      catch (e) {
            res.status(400).json(e)
      }
});

app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      const userDoc = await USER.findOne({ username });
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
            //logged in
            jwt.sign({ username, id: userDoc._id }, process.env.SECRET_KEY, {}, (err, token) => {
                  if (err) throw err;
                  res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                  });
            });
      }
      else {
            res.status(400).json('Wrong credentials')
      }
});

// app.get('/profile', (req, res) => {
//       const { token } = req.cookies;
//       jwt.verify(token,  process.env.SECRET_KEY , {}, (err, info) => {
//             if (err) throw err;
//             res.json(info);
//       });
// });

app.post('/logout', (req, res) => {
      res.cookie('token', '').json('ok');
});

app.post('/post',uploadMiddleware.single('file') ,async(req, res) => {
   const {originalname,path}= req.file;
   const parts = originalname.split('.');
   const ext = parts[parts.length - 1];
   const newPath = path+'.'+ext
   fs.renameSync(path,newPath);
 
   const { token } = req.cookies;
   jwt.verify(token,  process.env.SECRET_KEY , {}, async(err, info) => {
      if (err) throw err;
      const{title,summary,content}=req.body
      const PostDoc = await Post.create({
         title,
         summary,
         content,
         cover:newPath,
         author:info.id,
      })
      res.json(PostDoc);
});
});

app.get('/post',async(req,res)=>{
      res.json(
            await Post.find()
            .populate('author',['username'])
            .sort({createdAt: -1})
            .limit(20)
            );
});

app.get('/post/:id',async(req,res)=>{
      const {id} = req.params;
      const postDoc = await Post.findById(id).populate('author',['username']);
      res.json(postDoc);
})

app.listen(port, console.log("Server Start"));
