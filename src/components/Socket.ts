import socketio from 'socket.io-client';

const { REACT_APP_API_URL } = process.env;

// 1, socket 연결
const Socket = socketio.connect(`${REACT_APP_API_URL}`);

// const { Provider, Consumer } = React.createContext(defaultValue);

const SocketClient = props => {
  interface stonePush {
    stoneId: number;
    actor: string;
    angle: number;
    power: number;
    currentPostion: Array<number>;
  }
  // user가 로그인을 하고 서버에 정보를 emit
  const userData = {
    name: props.user.name,
    email: props.user.email,
    userID: props.user.id,
    picture: props.user.picture.data.url,
  };
  Socket.emit('userLogin', userData);
  // 이름, 이메일, userID, picture url

  // 2. 입장하기를 눌렀을 때 현재의 게임룸 상태를 받아오기
  // 현재 방이 열려있는지, 혹은 시작한 상태인지, 새로 만들어야 되는 상태인지

  const gameRoomStateData = {
    id: 'uuid_strings', // uuid string, same as unique url
    status: 'started', // enum value, [waiting, started, done]
    mode: {
      // judge win or loose, judging in backend
      id: 1,
      size: 2, // for player limit
      name: 'classic push stone - 1vs 1',
      isTurn: true, // turn base, e.g. my turn -> your turn -> my turn, false mean is realtime
      turnLimit: 3000, // turn limit time, 0 is unlimit
      actionDuration: 500, // time limit for after action
      moveLimit: 0, // move limit per game, 0 is unlimit
    },
    user: {
      player: [
        // <player>, // has level, ability, game history(win, loose)
        {
          id: 'uuid',
          name: 'nameeee',
          won: 33,
          loose: 67,
          weight: 1, // play order, highest weight move first
          stones: [
            {
              id: 'uuid',
              position: {
                lat: 3.3,
                lon: 3.3,
              },
            },
          ],
        },
      ],
      observer: [
        // <user>,
        {
          id: 'uuid',
          name: 'nameeee',
          won: 33,
          loose: 67,
        },
      ],
    },
    tile: {
      width: 1000,
      height: 1000,
    },
    // events(push, crush), join, leave.... per game room
    history: [
      //<event>,
      {
        type: 'join_room', // define event types
        actor: '<player_id>',
      },
    ],
  };

  Socket.on('gameRoomState', function(obj: any): void {
    console.log(obj);
    // 3. 그 다음 어떻게 행동해야될지 if문을 통해 emit 해주기

    // gameroomState가 started 면 게임룸으로 redirect 해주기

    // 3-1. 방이 없다면 만들기
    if (true) {
      //
    }

    // 3-2. 방에 입장하기
    else if (false) {
    }

    // 3-3. 게임 중인 경우
    else {
    }
  });

  // 4. GameStart을 보내주고 내가 들어갈 gameRoomInfo를 기다림
  // Socket.emit('gameStart', function(obj: any): void {
  //   console.log(obj);

  // });

  //  => 정보를 가지고 퉁치자.

  // 5. gameRoomInfo가 오면 경기장으로 입장 + 입장할 때의 돌의 랜덤 위치도 받아와야 할듯하다.
  Socket.on('gameRoomInfo', function(obj: any): void {
    console.log(obj);
    // 하트비트처럼 사용할 듯
  });

  // 6. pushStone.
  const pushStoneData = {
    id: 'uuid',
    owner: 'player_id',
    position: {
      lat: 3.3,
      lon: 10,
    },
    action: {
      power: 33,
      degree: 90,
    },
  };
  // Socket.emit("pushStone", function(obj: any): void {
  //   console.log(obj);
  // });

  // 7. game이 끝나는 이벤트.
  Socket.on('finishGame', function(obj: any): void {
    console.log(obj);
    // 소켓을 안끊어도 괜찮을 지..
  });

  // 추가 사항
  //1. crushStone이나 deadStone을 클라이언트에서 처리할지 서버에서 처리할지에 대한 상의 => 따로 넘겨주는 방식. 위치 부딪힌 돌들, timestamp => 판별로직 클라이언트
  // 2. 게임이 끝나고 소켓연결 해지하는가
};

export default SocketClient;

export { Socket };
