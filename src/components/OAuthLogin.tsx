import React from 'react';

import { useCookies } from 'react-cookie';

import FacebookLogin from 'react-facebook-login';

const fbKey: any = process.env.REACT_APP_FACEBOOK_KEY;

const Login = () => {
  const [cookie, setCookie] = useCookies(['user']);
  // const handleFacebookLogin = (response: any): void => {
  //   setCookie('user', response);
  // };
  const handleFacebookLogin = response => {
    // presenter에 props로 전달
    console.log(response);
    setCookie('user', response);
  };
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
