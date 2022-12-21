const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/users");

// Load input validation
const validatePostInput = require("../validation/post");

//create post
router.post('/', async(req, res) => {
    try{
        const { errors, isValid } = validatePostInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const postBody = req.body;
        postBody.userId = req.userId;

        const newPost = new Post(postBody);
        const savedPost = await newPost.save();

        res.status(200).json({
            "success": true,
            "data": savedPost
        });
    } catch(err) {
        return res.status(500).json(err);
    }
});
//update post
router.put('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.userId) {
            await post.updateOne({
                $set: req.body
            });
            
            res.status(200).json({
                "success": true,
                "msg": "Post updated"
            });
        } else {
            res.status(401).json({
                "success": true,
                "msg": "You can only update your post"
            });
        }

    } catch(err) {
        return res.status(500).json(err);
    }
});

//delete post
router.delete('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.userId) {
            await post.deleteOne();
            
            res.status(200).json({
                "success": true,
                "msg": "Post deleted"
            });
        } else {
            res.status(401).json({
                "success": true,
                "msg": "You can only update your post"
            });
        }
    } catch(err) {
        return res.status(500).json(err);
    }
});

//get post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.userId);
        res.status(200).json({
            "success": true,
            "data": post
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

//get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId: friendId});
            })
        )

        res.status(200).json({
            "success": true,
            "data": userPosts.concat(...friendPosts)
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});
//get posts by user
router.get('/user/:userId', async (req, res) => {
    try {
        const userPosts = await Post.find({userId: req.params.userId});
        
        res.status(200).json({
            "success": true,
            "data": userPosts
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

//like 
router.get('/:id/like', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post.likes.includes(req.userId)){
            await post.updateOne({
                $push: { likes: req.userId }
            });
        } else {
            await Post.updateOne({
                $pull: { likes: req.userId }
            }); 
        }

        res.status(200).json({
            "success": true
        });
    } catch (err) {
        console.log(req.userId);
        return res.status(500).json(err);
    }
})

module.exports = router;