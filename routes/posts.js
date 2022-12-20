const router = require("express").Router();
const Post = require("../models/post");

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

        const newPost = new Post(req.body);
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
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json({
            "success": true,
            "msg": "Post updated"
        });
    } catch(err) {
        return res.status(500).json(err);
    }
});

//delete post
router.delete('/:id', async(req, res) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            "success": true,
            "msg": "Post deleted"
        });
    } catch(err) {
        return res.status(500).json(err);
    }
});
//get post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        res.status(200).json({
            "success": true,
            "data": post
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});
//get timeline posts
//like 


module.exports = router;