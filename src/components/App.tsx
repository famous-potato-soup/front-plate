import React from "react";
import "./App.css";

import { withCookies, useCookies } from "react-cookie";

import FacebookLogin from "./OAuthLogin";

const App: React.FC = () => {
  const [cookie, removeCookie] = useCookies(["user"]);
  function removeUserCookie(): void {
    removeCookie("user", "");
  }
  return (
    <div className="App">
      <header className="App-header">
        {cookie.user ? (
          <button onClick={removeUserCookie}>로그아웃</button>
        ) : (
          <FacebookLogin />
        )}
      </header>
    </div>
  );
};

export default withCookies(App);
