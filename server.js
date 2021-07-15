const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
// ルートの読み込み
const usersRouter = require('./routers/api/users');
const authRouter = require('./routers/api/auth');
const profileRouter = require('./routers/api/profile');
const postsRouter = require('./routers/api/posts');

const app = express();

// mongoDBと接続をする
connectDB();

// ミドルウェアの初期化
// falseにすることでリクエストデータをreq.bodyで取得できるようになる。
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => {
//   res.send('API Running');
// });

// 各種のルート定義
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

//  serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));

  app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
