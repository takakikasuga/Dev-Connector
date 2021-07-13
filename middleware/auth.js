const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // ヘッダーからトークンを取得する（x-auth-token：キー名称）
  const token = req.header('x-auth-token');

  // トークンの有無を確認
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // jwtトークンが今でも有効化を確認する（返り値はペイロード）
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log('decoded', decoded);
    // req.userの中にはユーザーの一意のIDが入ったオブジェクト格納されている
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Token is not valid'
    });
  }
};
