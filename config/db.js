const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

console.log('db', db);
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    // 接続に失敗した場合にアプリを強制終了させる
    process.exit(1);
  }
};

module.exports = connectDB;
