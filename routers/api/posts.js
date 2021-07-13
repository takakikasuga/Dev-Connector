const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

const auth = require('../../middleware/auth');

// @route     POST api/posts
// @desc      Create a post
// @access    Private

router.post(
  '/',
  [auth, body('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //  errors.array();でエラーの内容をレスポンスする
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avator: user.avator,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json({ post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     GET api/posts
// @desc      GET all posts
// @access    Private

router.get('/', auth, async (req, res) => {
  try {
    // sort({ date: -1 });は降順として指定
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     GET api/posts/:id
// @desc      GET post by ID
// @access    Private

router.get('/:id', auth, async (req, res) => {
  try {
    // sort({ date: -1 });は降順として指定
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route     DELETE api/posts/:id
// @desc      DELETE a post
// @access    Private

router.delete('/:id', auth, async (req, res) => {
  try {
    // sort({ date: -1 });は降順として指定
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // ユーザーがどうかをチェックする
    console.log('post.use', post.user);
    console.log('post.use.toString()', post.user.toString());
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
