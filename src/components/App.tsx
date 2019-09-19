import React, { useState } from 'react';
import './App.css';

import { withCookies, useCookies } from 'react-cookie';

import LoginComponent from './tsx/OAuthLogin';
import ReadyComponent from './tsx/ReadyComponent';
import { Board } from './board';

const App: React.FC = () => {
  const [isGaming, setIsGaming] = useState<boolean>(false);
  const [cookie] = useCookies(['user']);

  const handleGameStart = () => {
    setIsGaming(true);
  };

  return (
    <div className="App">
      <div className="content">
        {cookie.user ? isGaming ? <Board /> : <ReadyComponent onGameStart={handleGameStart} /> : <LoginComponent />}
      </div>
      {/* <WinComponent /> */}
    </div>
  );
};

export default withCookies(App);
