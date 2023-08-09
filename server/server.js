const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "../.env" });
const { authenticateToken } = require("./module/accessToken/authenticateToken");
const { cleanUpExpiredTokens } = require("./module/accessToken/cleanUpExpiredTokens");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_CONNECTION;
const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

// MongoDB 연결 설정
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB에 연결되었습니다.");
  })
  .catch((error) => {
    console.error("MongoDB 연결에 실패했습니다.", error);
  });

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../build")));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/protected", authenticateToken(accessTokenSecretKey));

app.use("/api/users", userRouter);
app.use("/api/protected/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/protected/posts", postRouter);

// 대댓글 작성 (기능 미구현)
// app.post("/api/comments/:commentId/replies", async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const { comment, author } = req.body;

//     const parentComment = await Comment.findById(commentId);
//     if (!parentComment) {
//       return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
//     }

//     const newReply = { comment, author };
//     parentComment.replies.push(newReply);
//     await parentComment.save();

//     res.status(201).json(parentComment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "서버 에러" });
//   }
// });

// 주기적으로 만료된 토큰 정리 작업 수행

setInterval(() => {
  cleanUpExpiredTokens();
}, 10 * 60 * 1000);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
