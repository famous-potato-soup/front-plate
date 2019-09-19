import React from 'react';
import './App.css';

import { withCookies, useCookies } from 'react-cookie';

import LoginComponent from './tsx/OAuthLogin';
import ReadyComponent from './tsx/ReadyComponent';
import { WinComponent, LoseComponent } from './tsx/Result';

const App: React.FC = () => {
  const [cookie] = useCookies(['user']);
  return (
    <div className="App">
      <div className="content">{cookie.user ? <ReadyComponent /> : <LoginComponent />}</div>
      {/* <WinComponent /> */}
    </div>
  );
};

export default withCookies(App);
