import React from 'react';
import './App.css';

import { withCookies, useCookies } from 'react-cookie';

import Login from './OAuthLogin';
import SocketClient from './Socket';
// import { Socket } from "./Socket";

import socketio from 'socket.io-client';

const { REACT_APP_API_URL } = process.env;
const Socket = socketio.connect(`${REACT_APP_API_URL}`);

// import thumb from "../assets/img-win.png";
// import stone from "../assets/oval.png";

const App: React.FC = () => {
  const [cookie, removeCookie] = useCookies(['user']);
  const removeUserCookie = () => {
    removeCookie('user', '');
  };
  if (cookie.user) {
    SocketClient(cookie);
  }
  const gameStart = () => {
    Socket.emit('gameStart', cookie.user);
  };

  const userData = {
    name: 'props.user.name',
    email: 'props.user.email',
    userID: 'props.user.id',
    picture: 'props.user.picture.data.url',
  };
  Socket.emit('userLogin', userData);
  Socket.on('gameStart', roomData => console.log(roomData));
  Socket.on('shoot', data => console.log(data)); // 누가 쏴서 어디로 움직이는지 알기 위해서
  Socket.on(
    'moveEnd',
    data => console.log(data),
    // const moveEndData = {
    //   tile,
    //   player: [
    //     stones: [],
    //   ],
    //   isGameFinished: boolean,
    //   gameResult:{

    //   }
    // }
  ); // 초를 막기 위해서 game끝나는 것 확인하기.
  Socket.on('canShoot', data => console.log); // 중간에 악용하는 애들을 막기 위해서...

  return (
    <>
      <div className="App">
        <div className="content">
          {cookie.user ? (
            <>
              <div className="info">
                <div className="firstInfo info">
                  <div className="stoneInfo info">{/* <img src={stone} alt="stone" /> */}</div>
                  <div className="myInfo info">
                    <div className="user-img">
                      <img src={cookie.user.picture.data.url} />
                    </div>
                    <p className="user_name"> {cookie.user.name}</p>
                    <p>{cookie.user.email}</p>
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
            <Login />
          )}
        </div>
        <div className="thumb_wrap">{/* <img src={thumb} alt="thumb_img" /> */}</div>
      </div>
    </>
  );
};

export default withCookies(App);
