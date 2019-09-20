import React from "react";
import { useCookies } from "react-cookie";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import styled from "styled-components";
import { SocketClient } from "../ts/Socket";

import "./OAuthLogin.css";

import logo from "../../assets/img-logo.png";
import Stone from "../../assets/loginOval.png";

const fbKey: any = process.env.REACT_APP_FACEBOOK_KEY;
const { REACT_APP_API_URL } = process.env;

const LoginComponents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const LoginComponent = () => {
  const [cookie, setCookie] = useCookies(["user"]);
  const handleFacebookLogin = (response: any): void => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: response.accessToken }, null, 2)],
      {
        type: "application/json"
      }
    );
    const options: Object = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };
    fetch(`${REACT_APP_API_URL}`, options).then(r => {
      const token = r.headers.get("x-auth-token");
      r.json().then(user => {
        if (token) {
          console.log(user, token);
        }
      });
    });
    setCookie("user", response);
    SocketClient(cookie.user);
  };
  return (
    <LoginComponents className="LoginComponent">
      <div className="logoImg_wrap zOpt">
        <img src={logo} alt="logo" className="logoImg" />
      </div>
      <div className="Facebook_wrap zOpt">
        <FacebookLogin
          appId={fbKey} // facebook developer 페이지에 생성한 앱의 아이디
          autoLoad={false}
          fields="name,email,picture" // 페이스북에서 가져올 필드
          callback={handleFacebookLogin} // 콜백함수 지정( container에 생성 )
          // cssClass="my-facebook-button-class"
          render={renderProps => (
            <button
              className="my-facebook-button-class"
              onClick={renderProps.onClick}
            ></button>
          )}
        />
      </div>
      <div className="logoImg_wrap bottom">
        <img src={Stone} alt="stone" className="stone" />
      </div>
    </LoginComponents>
  );
};

export default LoginComponent;
