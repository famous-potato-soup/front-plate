import React from 'react';

import { GameBoard } from '../../gameComponents';
import { SocketNameSpace } from '../tsx/ReadyComponent';
import { WinComponent, LoseComponent } from '../tsx/Result';
import { withCookies } from 'react-cookie';
import './Board.css';

export interface BoardProps {}

class Board extends React.Component<BoardProps> {
  constructor(props) {
    const { cookies } = props;
    super(props);
    this.state = {
      gamingPage: true,
      winner: true,
      flag: true,
      user: cookies.get('user'),
    };
  }

  private gameBoard?: GameBoard;

  componentDidMount() {
    this.gameBoard = new GameBoard({
      autoFocus: true,
      width: 1500,
      height: 1500,
      parent: 'phaser-parent',
    });
    SocketNameSpace.on('GameOver', looser_email => {
      this.setState({ gamingPage: false });
      console.log(looser_email);
      if (this.state['user'].email === looser_email) {
        this.setState({ winner: true });
      } else {
        this.setState({ winner: false });
      }
    });
  }

  render() {
    console.log(this.state['winner']);
    // 어차피 한 페이지에 하나 마운트할 거니까 괜찮지 않을까...?
    return this.state['gamingPage'] ? (
      <div id="phaser-parent" />
    ) : this.state['winner'] ? (
      <LoseComponent />
    ) : (
      <WinComponent />
    );
  }
}

export default withCookies(Board);
