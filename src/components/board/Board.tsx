import React from 'react';

import { GameBoard } from '../../gameComponents';

export interface BoardProps {
  autoFocus: boolean;
}

class Board extends React.PureComponent<BoardProps> {
  private gameBoard: GameBoard;

  constructor(props: BoardProps) {
    super(props);

    this.gameBoard = new GameBoard(props);
  }

  render() {
    return <></>;
  }
}

export default Board;
