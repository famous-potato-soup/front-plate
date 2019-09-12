import React, { useState, useEffect } from "react";
import "./App.css";

import { withCookies, useCookies } from "react-cookie";

import FacebookLogin from "./OAuthLogin";

const App: React.FC = () => {
  const [view, viewState] = useState(false);
  const [cookie] = useCookies(["user"]);
  useEffect(() => {
    // login정보가 redux를 통해 변경되면 여기서 cookie에 저장해주기
  });
  return (
    <div className="App">
      <header className="App-header">
        <div onClick={() => viewState(!view)}>
          {view ? "로그인 되었습니다." : <FacebookLogin />}
        </div>
      </header>
    </div>
  );
};

export default withCookies(App);
