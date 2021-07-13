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

module.exports = router;
