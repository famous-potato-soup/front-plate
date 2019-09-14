import React from 'react';
import './App.css';

import { withCookies, useCookies } from 'react-cookie';

import FacebookLogin from './OAuthLogin';
import SocketClient from './Socket';
import { Socket } from './Socket';

import thumb from '../assets/img-win.png';

const App: React.FC = () => {
  const [cookie, removeCookie] = useCookies(['user']);
  const removeUserCookie = () => {
    removeCookie('user', '');
  };
  SocketClient(cookie);
  const gameStart = () => {
    Socket.emit('gameStart', cookie.user);
  };
  return (
    <>
      <div className="App">
        <div className="content">
          {cookie.user ? (
            <>
              <div className="info">
                <div className="firstInfo info">
                  <div className="stoneInfo info">
                    <h2>stone info</h2>
                  </div>
                  <div className="myInfo info">
                    <div className="user-img">
                      <img src={cookie.user.picture.data.url} />
                    </div>
                    <p>name: {cookie.user.name}</p>
                    <p>email: {cookie.user.email}</p>
                  </div>
                </div>
                <div className="secondInfo">
                  <div className="rank info">
                    <h2>rank</h2>
                  </div>
                  <div className="start_wrap info">
                    <button className="GameStart-btn" onClick={gameStart}>
                      <p>Game Start</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="logout-btn_wrap">
                <button className="logout-btn" onClick={removeUserCookie}>
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <FacebookLogin />
          )}
        </div>
        <div className="thumb_wrap">
          <img src={thumb} alt="thumb_img" />
        </div>
      </div>
    </>
  );
};

export default withCookies(App);
