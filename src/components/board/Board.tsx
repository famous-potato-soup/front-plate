import React from 'react';

import { GameBoard } from '../../gameComponents';

import './Board.css';

export interface BoardProps {
  onDestroy: () => void;
}

class Board extends React.PureComponent<BoardProps> {
  private gameBoard?: GameBoard;

  componentDidMount() {
    this.gameBoard = new GameBoard({
      autoFocus: true,
      width: 1500,
      height: 1500,
      parent: 'phaser-parent',
      onDestroy: this.onDestroy,
    });
  }

  onDestroy = () => {
    this.props.onDestroy();
  };

  render() {
    // 어차피 한 페이지에 하나 마운트할 거니까 괜찮지 않을까...?
    return <div id="phaser-parent"></div>;
  }
}

export default Board;
