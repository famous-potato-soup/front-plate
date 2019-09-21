import React, { useState } from 'react';
import './App.css';

import { withCookies, useCookies } from 'react-cookie';

import LoginComponent from './tsx/OAuthLogin';
import { ReadyComponent } from './tsx/ReadyComponent';
import { Board } from './board';

import { WinComponent, LoseComponent } from './tsx/Result';

const App: React.FC = () => {
  const [isGaming, setIsGaming] = useState<boolean>(false);
  const [cookie] = useCookies(['user']);

  const handleGameStart = () => {
    setIsGaming(true);
    console.log(cookie.user);
  };
  return (
    <div className="App">
      <div className="content">
        {!cookie.user ? (
          <LoginComponent />
        ) : isGaming ? (
          <Board />
        ) : cookie.user.victory === undefined ? (
          <ReadyComponent onGameStart={handleGameStart} />
        ) : cookie.user.victory ? (
          <WinComponent />
        ) : (
          <LoseComponent />
        )}
        {/* <WinComponent /> */}
      </div>
    </div>
  );
};

export default withCookies(App);
