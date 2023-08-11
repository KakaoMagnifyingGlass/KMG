const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const { convertToKrTime } = require("../../utilities/convertToKrTime");

const createComment = async (req, res) => {
  console.log(req.path);
  try {
    const { comment, isPrivateComment } = req.body;
    const { userId, nickname } = res.locals;
    const { postId } = req.params;
    console.log(`댓글 작성 시도: userId - ${userId}`);

    // 요청 데이터에 내용이 없는 경우
    if (!comment) {
      return res.status(400).json({ status: "400-2", error: "댓글을 입력해야 합니다." });
    }

    console.log(comment, "?");

    const newComment = await Comment.create({
      postId,
      comment,
      userId,
      nickname,
      isPrivateComment,
      createdAt: convertToKrTime(new Date()),
    });

    // 게시물 댓글 수 +1
    await Post.findOneAndUpdate({ postId }, { $inc: { commentCount: 1 } });

    // 댓글 작성 성공
    console.log(`댓글 작성 성공: userId - ${userId}`);
    res.status(200).json({
      message: `댓글 (${comment})의 작성이 완료되었습니다.`,
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    if (error._message === "Comment validation failed") {
      return res.status(400).json({ message: "댓글 내용을 입력해야 합니다." });
    }

    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

module.exports = createComment;
