const Post = require("../../models/Post");

const viewPosts = async (req, res) => {
  console.log(req.path);
  try {
    console.log(`게시판 조회 시도`);
    const posts = await Post.find();
    const reversedPosts = posts.reverse();
    console.log(`게시판 조회 성공`);
    res.status(200).json({ message: `게시판 조회가 완료되었습니다.`, posts: reversedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "게시판 조회 작업 수행 중 문제가 발생하였습니다." });
  }
};

module.exports = viewPosts;
