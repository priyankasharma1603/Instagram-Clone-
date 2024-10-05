const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requiredLogin');
const Post = mongoose.model("Post");

// GET all posts
router.get('/allpost', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .sort('-createdAt');
        res.json({ posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getsubpost',requireLogin,(req,res)=>{

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

// POST create a new post
router.post('/createpost', requireLogin, async (req, res) => {
    const { title, body, photo } = req.body;

    // Validate input fields
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    req.user.password = undefined; // Remove password from user object
    const post = new Post({ title, body, photo, postedBy: req.user });

    try {
        const result = await post.save();
        res.status(201).json({ post: result });
    } catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json({ error: "Post creation failed" });
    }
});

// GET user's own posts
router.get('/mypost', requireLogin, async (req, res) => {
    try {
        const mypost = await Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name");
        res.json({ mypost });
    } catch (err) {
        console.error("Error fetching user's posts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT like a post
router.put('/like', requireLogin, async (req, res) => {
    const { postId } = req.body;

    // Check if postId is valid
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(422).json({ error: "Invalid post ID" });
    }

    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $push: { likes: req.user._id }
        }, {
            new: true,
            useFindAndModify: false
        }).populate("postedBy", "_id name");

        if (!result) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(result);
    } catch (err) {
        console.error("Error liking post:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT unlike a post
router.put('/unlike', requireLogin, async (req, res) => {
    const { postId } = req.body;

    // Check if postId is valid
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(422).json({ error: "Invalid post ID" });
    }

    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true,
            useFindAndModify: false
        }).populate("postedBy", "_id name");

        if (!result) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(result);
    } catch (err) {
        console.error("Error unliking post:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT comment on a post
router.put('/comment', requireLogin, async (req, res) => {
    const { postId, text } = req.body;

    // Validate input
    if (!text) {
        return res.status(422).json({ error: "Comment text cannot be empty" });
    }

    const comment = {
        text,
        postedBy: req.user._id
    };

    try {
        const result = await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment }
        }, {
            new: true,
            useFindAndModify: false
        })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name");

        if (!result) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(result);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE post
router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params;

    // Optional: Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(422).json({ error: "Invalid post ID" });
    }

    try {
        const post = await Post.findById(postId).populate("postedBy", "_id");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete this post" });
        }

        await Post.deleteOne({ _id: postId });
        res.json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});


module.exports = router;
