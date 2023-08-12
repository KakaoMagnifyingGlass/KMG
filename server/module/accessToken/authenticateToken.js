const jwt = require("jsonwebtoken");
const { verifyToken } = require("./jwtVerifyToken");
const { getAccessToken } = require("./getAccessToken");
const { createAccessToken } = require("./createAccessToken");
const User = require("../../models/User");

const ERROR_MESSAGES = {
  INVALID_TOKEN: "유효하지 않은 토큰",
  INVALID_USERID: "존재하지 않는 userId",
  EXPIRED_LOGIN: "로그인 기간 만료",
};

const EXPIRATION_TIME = "10s";

exports.authenticateToken = (accessTokenSecretKey) => async (req, res, next) => {
  console.log(`토큰 인증 시도 - ${req.path}`);
  try {
    const accessToken = req.headers.authorization && getAccessToken(req.headers.authorization);

    if (!accessToken) {
      console.log(`접근 에러: ${ERROR_MESSAGES.INVALID_TOKEN}`);
      return res.status(400).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
    }

    // 유저 정보 확인
    const decodedToken = jwt.decode(accessToken, accessTokenSecretKey);
    const requestedUserId = decodedToken && decodedToken.userId;
    const requestedUser = await User.findOne({ userId: requestedUserId });

    // 존재하지 않는 userId인 경우
    if (!requestedUser) {
      console.log(`접근 에러: ${ERROR_MESSAGES.INVALID_USERID}`);
      return res.status(400).json({ error: ERROR_MESSAGES.INVALID_USERID });
    }

    // accessToken 및 refreshToken 검증
    const isValidAccessToken = verifyToken(accessToken, accessTokenSecretKey);
    const isValidRefreshToken = verifyToken(requestedUser.refreshToken, accessTokenSecretKey);

    // 유효하지 않은 토큰이거나 로그인 기간이 만료된 경우
    if (!isValidAccessToken && !isValidRefreshToken) {
      console.log(`토큰 만료: A(${isValidAccessToken}) & R(${isValidRefreshToken})`);
      res.clearCookie("accessToken");
      return res.status(401).json({ error: `${ERROR_MESSAGES.EXPIRED_LOGIN}` });
    }

    // accessToken 만료 + 유효한 refreshToken인 경우, 새로운 accessToken 발급 및 쿠키 설정
    if (!isValidAccessToken && isValidRefreshToken) {
      console.log(`토큰 재발급: A(${isValidAccessToken}) & R(${isValidRefreshToken})`);
      const newAccessToken = createAccessToken(requestedUserId, accessTokenSecretKey);

      res.locals = { accessToken: newAccessToken };
    } else {
      // 유효한 accessToken을 가지고 있는 경우
      res.locals = { accessToken };
    }

    console.log("유효한 토큰 확인");
    // 다음 미들웨어로 유효한 accessToken을 소유한 user의 데이터 전달
    const { userId, nickname } = requestedUser;
    res.locals.userId = userId;
    res.locals.nickname = nickname;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: `${ERROR_MESSAGES.INVALID_TOKEN}` });
  }
};
