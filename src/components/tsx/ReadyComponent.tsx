import React, { useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { SocketClient, Socket } from "../ts/Socket";
import socketio from "socket.io-client";

import stone from "../../assets/oval.png";
import thumb from "../../assets/img-win.png";

const { REACT_APP_SOCKET_URL } = process.env;

let SocketNameSpace; // 게임 관련 코드

const ThumbWrap = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 30%;
`;

const Info = styled.div`
  position: relative;
  z-index: 3;
`;

const NumInputDescription = styled.div`
  font-size: 20px;
`;

export interface ReadyComponentProps {
  onGameStart: () => void;
}

const ReadyComponent: React.FC<ReadyComponentProps> = ({ onGameStart }) => {
  const [cookie, removeCookie] = useCookies(["user"]);
  const [fakeUI, setFakeUI] = useState<boolean>(false);
  const [numPlayers, setnumPlayers] = useState<integer>(2);
  const removeUserCookie = () => {
    removeCookie("user", "");
  };
  if (cookie.user) {
    SocketClient(cookie);
  }

  Socket.on("room", obj => {
    console.log(obj);
    SocketNameSpace = socketio.connect(`${REACT_APP_SOCKET_URL}${obj.id}`);
    setFakeUI(true);
    onGameStart();
    // SocketNameSpace.on("gameReady", obj => {
    //   onGameStart();
    //   console.log(obj);
    // });
  });

  const handleGameStart = () => {
    const data = {};
    Socket.emit("gameStart", data);
    Socket.emit("numPlayers", numPlayers);
  };

  const updateNumPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value){
      setnumPlayers(parseInt(e.target.value));
    }
  }

  return fakeUI ? (
    <h1>loading...</h1>
  ) : (
    <div id="loading" className="Info_wrap">
      <Info>
        <div className="infoContent firstInfo">
          <div className="stoneInfo info">
            <img src={stone} alt="stone" />
          </div>
          <div className="myInfo info">
            <div className="user-img">
              <img src={cookie.user.picture.data.url} alt="userpicture" />
            </div>
            <p className="user_name"> {cookie.user.name}</p>
            <p>{cookie.user.email}</p>
          </div>
        </div>
        <div className="infoContent secondInfo">
          <div className="rank info">
            <h2>rank</h2>
          </div>
          <div className="numPlayers info">
            <NumInputDescription>
              <span>Please input the number of players: </span>
            </NumInputDescription>
            <input name="numberofPlayers" type="text" value={numPlayers} min="0" onChange={updateNumPlayers}/>
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
      <ThumbWrap>
        <img src={thumb} alt="thumb_img" />
      </ThumbWrap>
    </div>
  );
};

export { ReadyComponent, SocketNameSpace };
