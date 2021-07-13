const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

// @route     GET api/auth
// @desc      Test route
// @access    Public

// auth：ヘッダーに有効なトークンを確認したら（ログインしている状態でGetリクエスト）
router.get('/', auth, async (req, res) => {
  try {
    //.select('-password');は返り値にパスワードを含めないようにすること。
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/suth
// @desc       Authenticate user & get token
// @access    Public
router.post(
  '/',
  [
    body('email', 'Please include a valid email address').isEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // エラーがあるか否かを確認する
    const errors = validationResult(req);
    console.log('errors', errors);
    console.log('errors.isEmpty()', errors.isEmpty());
    console.log(req.body);
    if (!errors.isEmpty())
      //  errors.array();でエラーの内容をレスポンスする
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      // 同じユーザーが既に存在するか否かの確認（既に存在したら登録できないようにする）
      let user = await User.findOne({ email });
      // ユーザーがいない場合はエラーを出す
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: ' Invalid Credentials' }] });
      }

      // 普通のパスワードと暗号化したパスワードが一致しているかを確認する
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(404)
          .json({ errors: [{ msg: ' Invalid Credentials' }] });
      }

      console.log('user', user);
      // jwtを返す
      const payload = {
        user: {
          // _idとしなくてもidでできるようになっている
          id: user._id
        }
      };

      console.log('payload', payload);
      // 3600;は1時間・jwt.signはトークンを発行する
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
