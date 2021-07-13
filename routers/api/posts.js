const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    console.log('errors', errors);
    console.log('errors.isEmpty()', errors.isEmpty());
    console.log(req.body);
    if (!errors.isEmpty())
      //  errors.array();でエラーの内容をレスポンスする
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      // 同じユーザーが既に存在するか否かの確認（既に存在したら登録できないようにする）
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // ユーザーのアバターを取得する（gravatarモジュール）
      // s：文字列（String）、r：評価（Rating）、d：標準（ Default）
      const avatar = gravatar.url(email, {
        size: '200',
        rating: 'pg',
        // mmはデフォルトで画像を差し込んでくれる（ミステリーマン）
        default: 'mm'
      });

      // 保存するためのインスタンスを作成
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // パスワードのハッシュ化
      // bcrypt.getSalt(10)の10はドキュメントの推奨
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send('User register');
    } catch (err) {}
    console.error(err.message);
    res.status(500).send('Server error');
  }
);

module.exports = router;
