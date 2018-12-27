import React from 'react';
import Board from '../Board/board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Board gridWidth={25} gridHeight={25}/>
      </div>
    );
  }
}

export default Game;
