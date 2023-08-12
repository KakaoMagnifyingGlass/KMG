const Comment = require("../../models/Comment");

const viewComments = async (req, res) => {
  console.log(req.path);
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId });

    if (!comments) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: `댓글 조회가 완료되었습니다.`,
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

module.exports = viewComments;
