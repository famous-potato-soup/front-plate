import React from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import SocketClient from '../ts/Socket';

import stone from '../../assets/oval.png';
import thumb from '../../assets/img-win.png';

const Thumb_wrap = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 30%;
`;

const Info = styled.div`
  position: relative;
  z-index: 3;
`;

export interface ReadyComponentProps {
  onGameStart: () => void;
}

const ReadyComponent: React.FC<ReadyComponentProps> = ({ onGameStart }) => {
  const [cookie, removeCookie] = useCookies(['user']);
  const removeUserCookie = () => {
    removeCookie('user', '');
  };
  if (cookie.user) {
    SocketClient(cookie);
  }

  const handleGameStart = () => {
    onGameStart();
  };

  return (
    <div className="Info_wrap">
      <Info>
        <div className="infoContent firstInfo">
          <div className="stoneInfo info">
            <img src={stone} alt="stone" />
          </div>
          <div className="myInfo info">
            <div className="user-img">
              <img src={cookie.user.picture.data.url} />
            </div>
            <p className="user_name"> {cookie.user.name}</p>
            <p>{cookie.user.email}</p>
          </div>
        </div>
        <div className="infoContent secondInfo">
          <div className="rank info">
            <h2>rank</h2>
          </div>
          <div className="start_wrap info">
            <button className="GameStart-btn" onClick={handleGameStart}>
              <p>Game Start</p>
            </button>
          </div>
        </div>
        <div className="logout-btn_wrap">
          <button className="logout-btn" onClick={removeUserCookie}>
            로그아웃
          </button>
        </div>
      </Info>
      <Thumb_wrap>
        <img src={thumb} alt="thumb_img" />
      </Thumb_wrap>
    </div>
  );
};

export default ReadyComponent;
