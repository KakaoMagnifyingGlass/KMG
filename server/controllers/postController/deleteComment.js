const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = res.locals;
    const { postId } = req.params;
    console.log(`댓글 삭제 시도: userId - ${userId}, commentId - ${commentId}`);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자와 로그인한 사용자가 일치하는지 확인
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findOneAndUpdate({ postId }, { $inc: { commentCount: -1 } });

    console.log(`댓글 삭제 완료: userId - ${userId}`);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

module.exports = deleteComment;
