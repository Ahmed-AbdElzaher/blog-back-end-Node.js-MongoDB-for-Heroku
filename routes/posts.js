const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require('jsonwebtoken');


// auth middleware
const authMiddleware = async (req, res, next) => {
    const {authorization} = req.headers
    const payload = jwt.verify(authorization , 'cdgisqekkh74g')
    const user = await User.findOne({username: payload.username}) 
    // console.log(user)
        if(user){
            // console.log(user)
            req.user = user; 
            next();    
        }else{
            next("user not found !")
        }
}


// CREATE
router.post("/" ,authMiddleware ,async (req, res) => {
    // console.log(req.user.username)
    const newPost = new Post(req.body);
    newPost.username = req.user.username
    try {
        const savedPost = await newPost.save();
        res.status(200).send(savedPost);
    } catch (error) {
        res.status(500).json(error)
    }
})

// UPDATE

router.put("/:id",authMiddleware ,async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.user.username && req.body.title.length > 3 && req.body.description.length > 20 ) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set: req.body
                },
                {new: true});
                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(401).json("not allowed")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// DELETE
router.delete("/:id",authMiddleware,async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.user.username) {
            try {
                await post.delete();
                res.status(200).json("deleted succssfully");
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(401).json("not allowed !")
        }
    } catch (error) {
        res.status(500).json(error);
    }

})

// GET 
router.get("/:id",async (req, res) => {
    if (req.params.id == 'userPosts'){
        const {authorization} = req.headers
        const payload = jwt.verify(authorization , 'cdgisqekkh74g')
        const user = await User.findOne({username: payload.username})     
        const username = user.username
        try {
            let posts;
            if(username){
                posts = await Post.find({username}); // = ({username:username})
                res.status(200).json(posts);
            }else{
                res.status(404).json('you have no posts yet');
            }
        } catch (error) {
            res.status(500).json(error)
        }
    
    }else{
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post)
        } catch (error) {
            res.status(404).json('post not found');
        }
    }
    
})

// GET All
router.get("/",async (req, res) => {
    const username = req.query.user; // /posts?username=Ahmed
    try {
        let posts;
        if(username){
            posts = await Post.find({username}); // = ({username:username})
        }else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/user",async (req, res) => {

    // const {authorization} = req.headers
    // const payload = jwt.verify(authorization , 'cdgisqekkh74g')
    // const user = await User.findOne({username: payload.username}) 
    // console.log(user)
    // const username = user.username; // /posts?username=Ahmed
    // console.log(req.user.username)
    // try {
    //     let posts;
    //     if(username){
    //         posts = await Post.find({username}); // = ({username:username})
    //         res.status(200).json(posts);
    //     }else{
    //         res.status(404).json('you have no posts yet');
    //     }
    // } catch (error) {
    // console.log(req.user.username)

    //     res.status(500).json(error)
    // }
})


module.exports = router;