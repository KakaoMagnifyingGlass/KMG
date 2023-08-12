const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const deletePost = async (req, res) => {
  console.log(req.path);
  try {
    const { userId } = res.locals;
    const { postId } = req.params; // postId 값을 조회
    console.log(`게시글 삭제 시도: postId - ${postId}`);

    // 게시글 조회
    const requestedPost = await Post.findOne({ postId });

    // 게시글이 존재하지 않으면 오류 응답
    if (!requestedPost) {
      return res.status(404).json({ message: "이미 삭제된 게시글입니다." });
    }

    // 사용자 인증 및 권한 검사
    if (requestedPost.userId !== userId) {
      return res.status(403).json({ message: "게시글을 삭제할 권한이 없습니다." });
    }

    // 게시글 삭제
    const deletedPost = await Post.findOneAndDelete({ postId });

    // 게시물에 작성되어 있던 댓글 삭제
    await Comment.deleteMany({ postId });

    console.log(`게시글 삭제 성공: postId - ${postId}`);
    res.status(200).json({
      message: `게시글 ${deletedPost.title}(postId:${deletedPost.postId})의 삭제가 완료되었습니다.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "게시글 삭제 작업 수행 중 문제가 발생하였습니다." });
  }
};
module.exports = deletePost;
