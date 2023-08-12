const Comment = require("../../models/Comment");

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment, isPrivateComment } = req.body;
    const { userId } = res.locals;

    // 요청 데이터에 내용이 없는 경우
    if (!comment) {
      return res.status(400).json({ status: "400-2", error: "댓글을 입력해야 합니다." });
    }

    const requestedComment = await Comment.findById(commentId);

    // 댓글 작성자와 로그인한 사용자가 일치하는지 확인
    if (requestedComment.userId !== userId) {
      return res.status(403).json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment, isPrivate: isPrivateComment },
      { new: true }
    );

    // 업데이트할 댓글이 존재하지 않을 경우
    if (!updatedComment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    console.log(`댓글 수정 성공: commentId - ${commentId}`);
    res.status(200).json({
      message: `댓글 ${updatedComment.title}(commentId:${updatedComment.commentId})의 수정이 완료되었습니다.`,
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};
module.exports = editComment;
