const Post = require("../../models/Post");

const checkPostAuthorization = async (req, res) => {
  console.log(req.path);
  try {
    const { userId } = res.locals;
    const { postId } = req.params; // postId 값을 조회
    console.log(`게시글 권한 확인 시도: postId - ${postId} userId - ${userId}`);

    // 게시글 조회
    const requestedPost = await Post.findOne({ postId });

    // 게시글이 존재하지 않으면 오류 응답
    if (!requestedPost) {
      return res.status(404).json({ message: "수정할 게시글을 찾을 수 없습니다." });
    }

    // 사용자 인증 및 권한 검사
    if (requestedPost.userId !== userId) {
      return res.status(403).json({ message: "게시글을 수정할 권한이 없습니다." });
    }

    console.log(`게시글 권한 확인 성공: postId - ${postId} userId - ${userId}`);
    res.status(200).json({
      message: `게시글 ${requestedPost.title}(postId:${requestedPost.postId})의 수정 권한 확인이 완료되었습니다.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "게시글 수정 작업 수행 중 문제가 발생하였습니다." });
  }
};
module.exports = checkPostAuthorization;
