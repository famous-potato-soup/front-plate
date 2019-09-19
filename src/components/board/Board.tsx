import React from 'react';

import { GameBoard } from '../../gameComponents';

import './Board.css';

export interface BoardProps {}

class Board extends React.PureComponent<BoardProps> {
  private gameBoard?: GameBoard;

  componentDidMount() {
    this.gameBoard = new GameBoard({
      autoFocus: true,
      width: 1000,
      height: 1000,
      parent: 'phaser-parent',
    });
  }

  render() {
    // 어차피 한 페이지에 하나 마운트할 거니까 괜찮지 않을까...?
    return <div id="phaser-parent"></div>;
  }
}

export default Board;
