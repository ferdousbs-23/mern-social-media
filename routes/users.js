const router = require("express").Router();
const User = require("../models/users");

//get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...userData} = user._doc;

        res.status(200).json({
            "success": true,
            "data": userData
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

//get logged in user
router.get('/get/own', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const {password, updatedAt, ...userData} = user._doc;

        res.status(200).json({
            "success": true,
            "data": userData
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

//update user
router.put('/:id', async (req, res) => {
    if (req.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrpyt.genSalt(10);
                req.body.password = await bcrpyt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });

            res.status(200).json({
                "success": true,
                "msg": "Account updated"
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
});


//delete user
router.delete('/:id', async (req, res) => {
    if (req.userId == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            res.status(200).json({
                "success": true,
                "msg": "Account deleted"
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account");
    }
});

//follow user
router.post('/:id/follow', async (req, res) => {
    if (req.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const curretUser = await User.findById(req.userId);

            if(!curretUser.following.includes(req.params.id)){
                await user.updateOne({$push: { followers: req.userId }});
                await curretUser.updateOne({$push: { following: req.params.id }});

                res.status(200).json({
                    "success": true,
                    "msg": "Account followed"
                });
            } else {
                res.status(403).json({
                    "success": false,
                    "msg": "You already following this user"
                })
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can not follow your account");
    }
});

//unfollow user
router.post('/:id/unfollow', async (req, res) => {
    if (req.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const curretUser = await User.findById(req.userId);

            if(curretUser.following.includes(req.params.id)){
                await user.updateOne({$pull: { followers: req.userId }});
                await curretUser.updateOne({$pull: { following: req.params.id }});

                res.status(200).json({
                    "success": true,
                    "msg": "Account unfollowed"
                });
            } else {
                res.status(403).json({
                    "success": false,
                    "msg": "You already unfollowed"
                })
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can not unfollow your account");
    }
});

module.exports = router;