const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: { type: Number, required: true, unique: true },
  userId: { type: String, required: true },
  nickname: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, default: Date.now().toLocaleString("ko-KR") },
  commentCount: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
