const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getTokenFromCookie } = require("../../module/accessToken/getTokenFromCookie");
const { createAccessToken } = require("../../module/accessToken/createAccessToken");
const { verifyToken } = require("../../module/accessToken/jwtVerifyToken");
const User = require("../../models/User");

const logInUser = async (req, res) => {
  console.log(req.path);

  try {
    // user 데이터 확인
    let { userId, password, isRememberMe } = req.body;

    let requestedAccessToken;
    if (req.headers && req.headers.cookie) {
      requestedAccessToken = getTokenFromCookie(req, res, "accessToken");
      const decodedToken = jwt.decode(requestedAccessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
      const requestedUserId = decodedToken && decodedToken.userId;
      userId = requestedUserId;
    }

    const userData = await User.findOne({ userId });

    // accessToken 없이 새롭게 로그인하는 경우
    if (!requestedAccessToken) {
      console.log(`로그인 시도 - ID: [${userId}]`);
      // 존재하지 않는 userId
      if (!userData) {
        console.log(`로그인 에러: 존재하지 않는 userId - ${userId}`);
        return res.status(401).json({ error: "존재하지 않는 ID입니다." });
      }

      // 일치하지 않는 password
      const isMatchedPassword = await bcrypt.compare(password, userData.password);
      if (!isMatchedPassword) {
        console.log(`패스워드 에러: 일치하지 않는 패스워드 userId - ${userId}`);
        return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
      }

      // 로그인 성공
      const refreshToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "7d",
        issuer: "young",
      });
      await User.updateOne(
        { userId },
        { $set: { refreshToken, tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
      );
      console.log(`새로운 refreshToken 발급: userId - [${userId}]`);

      // accessToken 발급
      const accessToken = createAccessToken(userId, isRememberMe);

      // 자동 로그인에 체크한 경우 쿠키에 accessToken 저장
      if (isRememberMe) {
        console.log(`자동 로그인: accessToken 쿠키에 저장 userId - ${userId}`);
        res.cookie("accessToken", accessToken);
      }

      console.log(`로그인 성공: userId - [${userId}]`);
      return res.status(200).json({
        message: "로그인되었습니다.",
        userId,
        accessToken,
        nickname: userData.nickname,
      });
    }

    // accessToken을 소유한 경우
    const isValidAccessToken = verifyToken(requestedAccessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    const decodedTokenData = jwt.decode(requestedAccessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    const requestedUserId = decodedTokenData.userId;
    const requestedUser = await User.findOne({ userId: requestedUserId });
    const isValidRefreshToken = verifyToken(
      requestedUser.refreshToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    const isRememberMeBefore = decodedTokenData.isRememberMe;
    console.log(`로그인 시도: userId - [${requestedUserId}]`);

    // 유효하지 않은 토큰이거나 로그인 기간이 만료된 경우
    if (!isValidAccessToken && !isValidRefreshToken) {
      console.log(`로그인 기간 만료:  R(${isValidRefreshToken})`);
      res.clearCookie("accessToken");
      return res.status(409).json({ error: "로그인 기간 만료" });
    }

    // accessToken이 만료되었지만 유효한 refreshToken을 가지고 있는 경우 newAccessToken 발급
    if (!isValidAccessToken && isValidRefreshToken) {
      console.log(`accessToken 재발급: A(${isValidRefreshToken}), R(${isValidRefreshToken})`);
      // newAccessToken 발급 및 쿠키 설정
      const accessToken = createAccessToken(
        requestedUserId,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        isRememberMeBefore
      );

      const beforeRememberMeData = isRememberMeBefore;
      if (isRememberMe || beforeRememberMeData) {
        console.log(`자동 로그인: accessToken 쿠키에 저장 userId - ${requestedUserId}`);
        res.cookie("accessToken", accessToken);
      }
    }

    // 유효한 accessToken을 가지고 있는 경우 로그인
    // accessToken 발급
    const accessToken = createAccessToken(userId, process.env.ACCESS_TOKEN_SECRET_KEY, isRememberMe);

    console.log(`로그인 성공: userId - [${requestedUser.userId}]`);
    return res.status(200).json({
      message: "로그인되었습니다.",
      userId: requestedUser.userId,
      accessToken,
      nickname: requestedUser.nickname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
  }
};

module.exports = logInUser;
