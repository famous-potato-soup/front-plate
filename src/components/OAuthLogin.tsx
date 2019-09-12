import React from "react";

import FacebookLogin from "react-facebook-login";

const fbKey: any = process.env.REACT_APP_FACEBOOK_KEY;

const handleFacebookLogin = (response: any): void => {
  console.log(response);
  // state에 넘겨줘서 저자아는 방식을 택하자.
  // const [cookie, setCookie] = useCookies(["user"]);
  // setCookie("user", response);
};

const Login: React.SFC = () => {
  return (
    <FacebookLogin
      appId={fbKey} // facebook developer 페이지에 생성한 앱의 아이디
      autoLoad={false}
      fields="name,email,picture" // 페이스북에서 가져올 필드
      callback={handleFacebookLogin} // 콜백함수 지정( container에 생성 )
      icon="fa-facebook-square" // 아이콘 지정
    />
  );
};

export default Login;
