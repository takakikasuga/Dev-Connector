const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// @route     POST api/posts
// @desc      Register User
// @access    Public
router.post(
  '/',
  [
    // 名前が渡ってきているかどうか（空ではない）
    body('name', 'Name is required').not().isEmpty(),
    // password must be at least 5 chars long
    body('email', 'Please include a valid email address').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log('errors', errors);
    console.log('errors.isEmpty()', errors.isEmpty());
    console.log(req.body);
    if (!errors.isEmpty())
      //  errors.array();でエラーの内容をレスポンスする
      return res.status(400).json({ errors: errors.array() });
    res.send('Posts Router');
  }
);

module.exports = router;
