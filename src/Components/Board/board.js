import React from 'react';
import Square from '../Square/square';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.gameBoard = React.createRef();
    this.state = {
      boardGrid: this.populateSquareIndexes(),
      snakePosition: 40,
      snakeBody: [40],
      foodPosition: undefined,
      direction: 'down',
      gameRunning: false,
      gamePaused: false,
      gameOver: false,
      snakeSpeed: 1,
    };
  }

  populateSquareIndexes(){
    const length = this.props.gridWidth;
    const height = this.props.gridHeight;
    let squareIndexes = [];
    let indexCounter = 0;
    let indexType = 'square';
    for( let i=0; i < length; i++ ){

      if (!squareIndexes[i]){
        squareIndexes[i] = [];
      }

      for (let j=0; j < height; j++ ) {
        indexCounter ++;
        squareIndexes[i].push([indexCounter, indexType]);
      }
    }
    // console.log('squareIndexes', squareIndexes);
    return squareIndexes;
  }

  gameOver ( nextCoordinate ){
    const lastPosition = this.props.gridWidth * this.props.gridHeight;
    const startCoordinate = this.state.snakePosition;
    const snakeBody = this.state.snakeBody.slice();

    if ( nextCoordinate < this.props.gridWidth && this.state.direction === 'up' ){
      console.log('top -> game is over');
      return true;
    }

    // touched bottom boundary -> number is more than availalbe cells
    if ( nextCoordinate > (this.props.gridWidth * (this.props.gridHeight -1)) && this.state.direction === 'down' ){
      console.log('bottom -> game is over');
      return true;
    }

    // Moving horisontally to right
    if ( nextCoordinate - startCoordinate  === 1) {
      // touched right boundary -> number is more than availalbe cells / or /
      // while moving to rignt in 1 step increments reached value different
      // than grid width
      if ( (this.state.snakeBody[0] % this.props.gridWidth) === 0 ){
        // console.log("condition brings this", startCoordinate % this.props.gridWidth);
        console.log('right -> game is over');
        return true;
      }
    }

    // Moving horisontally to left
    if ( nextCoordinate - startCoordinate === -1 ) {
      // touched left boundary -> number is negative or 0 / or / while moving to
      // left in 1 step increments reached value different that grid width
      if ( (this.state.snakeBody[0] % this.props.gridWidth) === 0 ){
        console.log('left -> game is over');
        return true;
      }
    }

    for (let i =1; i < this.state.snakeBody.length; i++){
      if(nextCoordinate === this.state.snakeBody[i] ){
        console.log('bitten itself, game over');
        return true;
      }
    }

    return false;
  }

  nextCoordinate(){
    const startCoordinate = this.state.snakePosition;
    const snakeBody = this.state.snakeBody.slice();
    const direction = this.state.direction;
    const gridWidth = this.props.gridWidth;
    const gridHeight = this.props.gridHeight;
    const lastPosition = this.props.gridWidth * (this.props.gridHeight -1);
    let nextCoordinate = 1;

    if (  direction === 'down' ){
      nextCoordinate = startCoordinate + this.props.gridWidth;
    }

    if ( direction === 'up' ){
      nextCoordinate = startCoordinate - this.props.gridWidth;
    }

    if ( direction === 'right' ){
      nextCoordinate = startCoordinate + 1;
    }

    if ( direction === 'left' ){
      nextCoordinate = startCoordinate - 1;
    }

    return nextCoordinate;
  }

  resetInitialState (){
    this.setState({
      boardGrid: this.populateSquareIndexes(),
      snakePosition: 40,
      snakeBody: [40],
      foodPosition: undefined,
      direction: 'down',
      gameRunning: false,
      gamePaused: false,
      gameOver: false,
      snakeSpeed: 1,
    });
  }

  handleKey (event) {
    let originalDirection = this.state.direction;
    let newDirection = 'down';
    // Fixme  - need different solution

    // don't allow snake to move itno itself
    // left
    if ( event.nativeEvent.keyCode === 37 ){
      if ( originalDirection === 'right'){
        newDirection = originalDirection;
      } else {
        newDirection = 'left';
      }
    }
    // up
    if ( event.nativeEvent.keyCode === 38 ){
      if ( originalDirection === 'down'){
        newDirection = originalDirection;
      } else {
        newDirection = 'up';
      }
    }
    // right
    if ( event.nativeEvent.keyCode === 39 ){
      if ( originalDirection === 'left'){
        newDirection = originalDirection;
      } else {
        newDirection = 'right';
      }
    }
    // down
    if ( event.nativeEvent.keyCode === 40 ){
      if ( originalDirection === 'up'){
        newDirection = originalDirection;
      } else {
        newDirection = 'down';
      }
    }

    this.setState({
      direction: newDirection,
    });
  }

  pauseGame () {
    console.log("pause game called");
    if ( this.state.gameRunning ){
      this.setState({
        gamePaused: true,
      });
    }
  }

  resumeGame () {
    this.setState({
      gamePaused: false,
      gameRunning: true,
    });
    this.moveSnake( 'resuming' );
  }

  eatFood ( nextCoordinate ){
    const foodPosition = this.state.foodPosition;
    if ( nextCoordinate === foodPosition ){
      console.log('food was eaten');
      return this.placeFood();
    }
    return foodPosition;
  }

  growSnake (snakeBody, nextCoordinate, foodPosition ){
    snakeBody.unshift(nextCoordinate);
    if ( snakeBody[0] === foodPosition ){
      return snakeBody;
    } else {
      snakeBody.pop();
    }

    return snakeBody;
  }

  focusGameBoard (){
    this.gameBoard.current.focus();
  }

  placeFood (){
    const minValue = 1;
    const maxValue = this.props.gridWidth * this.props.gridHeight;
    const foodPosition = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return foodPosition;
  }

  moveSnake( condition ){
    this.gameBoard.current.focus();

    console.log(" move snake called");

    if ( condition !== "resuming" ){
      this.setState({
        foodPosition: this.placeFood(),
        gameRunning: true,
      });
    }

    let updatedIndexes = this.state.boardGrid;
    const moveCounter = setInterval(
      () => {
        let gameOver = this.state.gameOver;
        let gamePaused = this.state.gamePaused;
        let gameRunning = this.state.gameRunning;

        if ( gameOver || gamePaused || !gameRunning ) {
          clearInterval(moveCounter);
        } else {
          const nextCoordinate = this.nextCoordinate();
          const snakeBody = this.state.snakeBody;
          const oldPosition = this.state.snakePosition;
          const foodPosition = this.state.foodPosition;

          const updatedSnakeBody = this.growSnake(snakeBody, nextCoordinate, foodPosition );

          // call grow snake here
          for ( let i=0; i < updatedIndexes.length; i++ ){
            updatedIndexes[i].map(
              function (item) {
                if ( snakeBody.includes(item[0] ) ){
                  item[1] = 'square snake';
                } else if ( item[0] === foodPosition ){
                  item[1] = 'square food';
                } else {
                  return item[1] = 'square';
                }
              }
            )
          }

          this.setState({
            foodPosition: this.eatFood(nextCoordinate),
            boardGrid: updatedIndexes,
            snakePosition: nextCoordinate,
            snakeBody: updatedSnakeBody,
            gameOver: this.gameOver(nextCoordinate),
          });
        }
      },
      1*1000
    );

  }

  render() {
    const boardGrid = this.state.boardGrid;
    let gamePaused = this.state.gamePaused;
    let gameOver = this.state.gameOver;
    let gameRunning = this.state.gameRunning;


    console.log("gameRunning", gameRunning);

    return (
      <div className="wrapper">
        <div className="action-buttons">
          <button
            onClick={ gameRunning ? () => this.resetInitialState() : () => this.moveSnake() }>
            {gameRunning ? 'Reset' : 'Start'}
          </button>
          <button
            onClick={ gamePaused ? () => this.resumeGame() : () => this.pauseGame() }>
            { gamePaused ? 'Resume' : 'Pause' }
          </button>
        </div>

        <div
          className="game-board"
          ref={ this.gameBoard }
          tabIndex={0}
          onKeyDown={ this.handleKey.bind(this) } >

          {boardGrid.map ((i) =>
            <div className="board-row" key={i}>
              {i.map ((j) =>
                <Square key={j[0]} squareType={j[1]}/>
              )}
            </div>
          )}
        </div>

      </div>
    );
  }
}

export default Board;
