import React, { createContext } from "react";
import socketio from "socket.io-client";

const { REACT_APP_API_URL } = process.env;

// 1, socket 연결
const Socket = socketio.connect(`${REACT_APP_API_URL}`);

// const { Provider, Consumer } = React.createContext(defaultValue);

const SocketClient = (): void => {
  interface stonePush {
    stoneId: number;
    actor: string;
    angle: number;
    power: number;
    currentPostion: Array<number>;
  }

  // user가 로그인을 하고 서버에 정보를 emit
  Socket.emit("userLogin", function(obj: any): void {
    console.log(obj);
  });

  // 2. 입장하기를 눌렀을 때 현재의 게임룸 상태를 받아오기
  // 현재 방이 열려있는지, 혹은 시작한 상태인지, 새로 만들어야 되는 상태인지
  Socket.on("gameRoomState", function(obj: any): void {
    console.log(obj);
    // 3. 그 다음 어떻게 행동해야될지 if문을 통해 emit 해주기

    // 3-1. 방이 없다면 만들기
    if (true) {
    }

    // 3-2. 방에 입장하기
    else if (false) {
    }

    // 3-3. 게임 중인 경우
    else {
    }
    // 3-4. 중간에 나가는 경우
    if (true) {
    }
  });

  // 4. GameStart을 보내주고 내가 들어갈 gameRoomInfo를 기다림
  Socket.emit("gameStart", function(obj: any): void {
    console.log(obj);
  });

  // 5. gameRoomInfo가 오면 경기장으로 입장 + 입장할 때의 돌의 랜덤 위치도 받아와야 할듯하다.
  Socket.on("gameRoomInfo", function(obj: any): void {
    console.log(obj);
  });

  // 6. pushStone.
  Socket.emit("pushStone", function(obj: any): void {
    console.log(obj);
  });

  // 7. game이 끝나는 이벤트.
  Socket.on("finishGame", function(obj: any): void {
    console.log(obj);
  });

  // 추가 사항
  //1. crushStone이나 deadStone을 클라이언트에서 처리할지 서버에서 처리할지에 대한 상의 => 따로 넘겨주는 방식. 위치 부딪힌 돌들., timestamp
  // 2. tsx말고 ts로 처리할 수 있을 듯 하다. App에 내려주기 위해서는 context를 쓰면 될까 (ts로 context 제길 ㅠ)
};

export default SocketClient;
