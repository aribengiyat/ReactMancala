import './App.css';
import React, { Component, useState, useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <Board/>
    </div>
  )
}
function Board(){
  //here we need to give this component a state that we can pass down to the store and pocket components through "props".
  let board = []
  for (let i=0; i<6; i++){
    board.push(3);
  }
  board.push(0);
  for (let i=0; i<6; i++){
    board.push(3);
  }
  board.push(0);
  const obj = {
    board: board,
    turnCounter: 0
  }
  const [state, setState] = useState(obj)

  let boardComponents = []; //we will put all the board components in this array.

  boardComponents.push(<Store key="player-2-store" class="store-13" state = {state}/>);
  for (let i=0; i<6; i++){
    boardComponents.push(<Pocket key={`player-2-pocket-${i}`} class={`pocket-${i+7}`} state = {state} func={resetState}/>);
  }
  boardComponents.push(<Store key="player-1-store" class="store-6" state={state} />);
  for (let i=0; i<6; i++){
    boardComponents.push(<Pocket key={`player-1-pocket-${i}`} class={`pocket-${i}`} state={state} func={resetState} />);
  }
  boardComponents.push(<TurnBox state={state} key = "TurnBox"/>)

  //this is for the general moving function
  function playerMove(position) {
    position = Number(position);
    let newBoard = [...state.board];
    let amountToDistribute = newBoard[position];
    newBoard[position] = 0;
    let currPos = position + 1;
    //for player 1, do move functionality
    if (state.turnCounter === 0) {
      while (amountToDistribute > 0) {
        console.log(currPos, newBoard[currPos]);
        if (currPos === 13) currPos = 0;
        newBoard[currPos] += 1;
        currPos++;
        amountToDistribute--;
      }
      currPos -= 1;
      if (currPos !== 6) {
        if (newBoard[currPos] === 1) {
          //grab from other side
            let temp = newBoard[12 - currPos];
            newBoard[12 - currPos] = 0;
            newBoard[6] += temp;
        }
      }
    }else {
      while(amountToDistribute > 0){
        if (currPos === 14) currPos = 0;
        if (currPos === 6) currPos = 7;
        newBoard[currPos] += 1;
        currPos++;
        amountToDistribute--;
      }
      currPos -= 1;
      if (currPos !== 13){
        if (newBoard[currPos] === 1){
          let temp = newBoard[12-currPos];
          newBoard[12-currPos] = 0;
          newBoard[13] += temp;
        }
      }
    }
    return newBoard;
    // setState({ board: newBoard, turnCounter: state.turnCounter === 0 ? 1 : 0});
  }
  function resetState(position) {
    setState({ board: playerMove(position), turnCounter: state.turnCounter === 0 ? 1 : 0 })
  }
  function isGameOver(){
    let player1Set = new Set(state.board.slice(0, 6));
    let player2Set = new Set(state.board.slice(7, 13));
    if ((player1Set.size === 1 && player1Set.has(0)) || (player2Set.size === 1 && player2Set.has(0))) return true;
    return false;
  }
  function scoreGame() {
    if (state.board[6] > state.board[13]) return "Player 1 won";
    else if (state.board[13] > state.board[6]) return "Player 2 won";
    else return "Draw";
  }
  // function findBestMove() {
  //   let boardState = [...state.board];
  //   let bestScore = -Infinity;
  //   let bestMove;
  //   for (let i=0; i<boardState.length; i++){
  //     if (i === 6 || i === 13) continue;
  //     if (boardState[i] === 0) continue;
      
  //     let currScore = miniMax(boardState)
  //   }
  // } 

  useEffect(() => {
    if (isGameOver() === true) console.log(scoreGame());
  })
  

  return(
    <div className="board-grid">
      {boardComponents};
    </div>
  )
}

function Store(props) {
  return (
    //the state that is passed down from Board will give the inner text to this div (it will go in between the tags). ie the number of marbles it holds. same for pocket below.
    <div className={props.class+ ' store'} >
      {props.state.board[props.class.slice(6)]}
    </div>
  )
}

function Pocket(props) {
  return (
    <div className={props.class+' pocket'} onClick={()=>{props.func(props.class.slice(7))}}>
      {props.state.board[props.class.slice(7)]}
    </div>
  )
}

function TurnBox(props) {
  return (
    <div className="turn-box"  style={{ backgroundColor: props.state.turnCounter === 0 ? `rgb(197, 191, 191)`:`white` }}>
      {` It is Player ${props.state.turnCounter + 1}'s turn!`}
    </div>
  )
}

export default App;
