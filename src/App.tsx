import MainPage from "./components/pages/MainPage";
import { Routes, Route } from "react-router-dom";
import AttachmentPage from "./components/pages/AttachmentPage";
import DashboardPage from "./components/pages/DashboardPage";
import Footer from "./components/sections/footer/Footer";
import DetailPage from "./components/pages/DetailPage";
import FloatingMenu from "./components/molecules/common/FloatingMenu";
import Wrapper from "./components/wrapper/Wrapper";
import GlobalStyle from "./style/GlobalStyles";
import Navigation from "./components/sections/navigation/Navigation";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { getTokenFromCookie } from "./module/common/getTokenFromCookie";
import PostPage from "./components/pages/PostPage";
import LogInForm from "./components/organisms/login/LogInForm";
import UserPage from "./components/pages/UserPage";
import SignUpForm from "./components/organisms/login/SignUpForm";
import { useDispatch } from "react-redux";
import { setUserLoginAccessTokenSlice } from "./store/reducer/userData/userLoginAccessTokenSlice";
import { setUserLoginDataSlice } from "./store/reducer/userData/userLoginDataSlice";
import { RememberMeData } from "./@types/index.d";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";

  useEffect(() => {
    const successValidToken = (data: RememberMeData) => {
      const { accessToken, nickname, userId } = data;
      dispatch(setUserLoginAccessTokenSlice(accessToken));
      dispatch(setUserLoginDataSlice({ nickname, userId }));
    };

    const cookieCheckForRememberLogin = async () => {
      const cookieAccessToken = getTokenFromCookie(document.cookie);
      if (cookieAccessToken) {
        const result = await axios.post("/api/users/login", null, {
          headers: {
            Authorization: `Bearer ${cookieAccessToken}`,
          },
        });
        const { accessToken, nickname, userId } = result.data;
        const rememberMeData = { accessToken, nickname, userId };
        successValidToken(rememberMeData);
      }
    };
    (async () => cookieCheckForRememberLogin())();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <FloatingMenu />
        <Navigation />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/attachment" element={<AttachmentPage />} />
          <Route>
            <Route path="/users" element={<UserPage />}>
              <Route path="login" element={<LogInForm />} />
              <Route path="create" element={<SignUpForm />} />
            </Route>
          </Route>
          <Route path="/posts" element={<PostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/detail" element={<DetailPage />} />

          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "80vh",
                  fontSize: "3rem",
                }}
              >
                404 ERROR: 존재하지 않는 페이지입니다. <br /> <br />
                준비중인 화면입니다.
              </div>
            }
          />
        </Routes>
        {isDashboardPage ? <Footer dashboard={true} /> : <Footer />}
      </Wrapper>
    </>
  );
}

export default App;
