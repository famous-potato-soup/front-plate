import React from 'react';

import { GameBoard } from '../../gameComponents';

export interface BoardProps {
  autoFocus: boolean;
}

class Board extends React.PureComponent<BoardProps> {
  private gameBoard: GameBoard;

  constructor(props: BoardProps) {
    super(props);

    this.gameBoard = new GameBoard({ width: 1000, height: 1000, ...props });
  }

  render() {
    return <></>;
  }
}

export default Board;
