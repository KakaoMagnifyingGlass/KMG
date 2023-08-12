import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FlexRowDiv } from "../../atoms/FlexDiv";
import { useDispatch } from "react-redux";
import { setUserLoginAccessTokenSlice } from "../../../store/reducer/userData/userLoginAccessTokenSlice";
import { setUserLoginDataSlice } from "../../../store/reducer/userData/userLoginDataSlice";
import { LoginFormData, LoginSuccessData } from "../../../@types/index.d";

const FormWrapper = styled.div`
  padding: 2rem;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--userPageBackground);
`;

const FormContainer = styled.div`
  width: 400px;
`;

const FormTitle = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const FormGroup = styled.form`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  line-height: 1.5;
  font-size: 1.3rem;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 1rem;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #ebebeb;
  font-size: 1.3rem;
`;

const AutoLoginBox = styled(FlexRowDiv)`
  margin-bottom: 5px;
  gap: 5px;
  > * {
    width: auto;
  }
  label {
    position: relative;
    top: 0.5px;
    font-size: 1.2rem;
  }
`;

const ErrorText = styled.div`
  margin-bottom: 10px;
  color: var(--mainRed);
`;

const Button = styled.button`
  padding: 1rem;
  width: 100%;
  background: var(--mainBlue);
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 1.7rem;
  cursor: pointer;

  &:hover {
    background: var(--mainBlueHover);
  }
`;

const SignUpBox = styled.div`
  font-size: 1.3rem;
  text-align: center;
`;

const SignUpButton = styled.span`
  margin-left: 5px;
  font-weight: 700;
  border-bottom: 1px solid var(--mainText);
`;

const LogInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  // 유효성 검사 메세지
  const [errMessage, setErrMessage] = useState<string>("");

  const handleClickRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };

  // LogIut Post 요청 보내기
  const postLogIn = async (loginFormData: LoginFormData) => {
    try {
      const result = await axios.post("/api/users/login", {
        ...loginFormData,
      });
      return result.data;
    } catch (error) {
      console.error(error);
    }
  };

  // LogIn Button 클릭 핸들러
  const handleSubmitLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (userId === "" || password === "") {
        window.alert("아이디 또는 비밀번호를 확인해주세요");
        return setErrMessage("아이디 또는 비밀번호를 확인해주세요");
      }

      const loginFormData = { userId, password, isRememberMe };
      const data = await postLogIn(loginFormData);
      handleLoginSuccess(data);
    } catch (error) {
      console.error(error);
      window.alert("로그인에 실패하였습니다.");
    }
  };

  // 브라우저에 accessToken 쿠키 저장
  const setCookie = (name: string, value: string, expirationTime: number) => {
    var expires = new Date();
    expires.setTime(expires.getTime() + expirationTime);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // LogIn 성공 이벤트
  const handleLoginSuccess = (data: LoginSuccessData) => {
    const { accessToken, expirationTime, nickname, userId } = data;
    dispatch(setUserLoginAccessTokenSlice(accessToken));
    dispatch(setUserLoginDataSlice({ nickname, userId }));
    setCookie("accessToken", accessToken, expirationTime);
    window.alert("로그인되었습니다.");
    navigate("/");
  };

  return (
    <FormWrapper>
      <FormContainer>
        <FormTitle>로그인</FormTitle>
        <FormGroup onSubmit={handleSubmitLogIn}>
          <Label>아이디</Label>
          <Input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            // placeholder="아이디"
          />
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // placeholder="비밀번호"
          />
          <AutoLoginBox>
            <Input
              type="checkbox"
              id="remember"
              checked={isRememberMe}
              onChange={() => handleClickRememberMe()}
            />
            <Label>로그인 상태 유지</Label>
          </AutoLoginBox>
          <ErrorText>{errMessage}</ErrorText>
          <Button type="submit">로그인</Button>
        </FormGroup>
        <SignUpBox>
          이미 회원이신가요??
          <SignUpButton>
            <Link to="/users/create">회원가입</Link>
          </SignUpButton>
        </SignUpBox>
      </FormContainer>
    </FormWrapper>
  );
};

export default LogInForm;
