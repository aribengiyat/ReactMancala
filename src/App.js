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
  function playerMove(position, boardState = [...state.board], turnCounter = state.turnCounter) {
    position = Number(position);
    let newBoard = [...boardState];
    let amountToDistribute = newBoard[position];
    newBoard[position] = 0;
    let currPos = position + 1;
    //for player 1, do move functionality
    if (turnCounter === 0) {
      while (amountToDistribute > 0) {
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
  }
  function resetState(position) {
    setState({ board: playerMove(position), turnCounter: state.turnCounter === 0 ? 1 : 0 })
  }
  function isGameOver(board = [...state.board]){
    let player1Set = new Set(board.slice(0, 6));
    let player2Set = new Set(board.slice(7, 13));
    if ((player1Set.size === 1 && player1Set.has(0)) || (player2Set.size === 1 && player2Set.has(0))) return true;
    return false;
  }
  function scoreGame(board = [...state.board]) {
    // console.log("Scoring the board: ", board);
    if (board[6] > board[13]) return "Player 1 won";
    else if (board[13] > board[6]) return "Player 2 won";
    else return "Draw";
  }
  function findBestMove() {
    let boardState = [...state.board];
    let bestScore = -Infinity;
    let bestMove;
    for (let i=0; i<boardState.length; i++){
      if (i === 6 || i === 13) continue;
      if (boardState[i] === 0) continue;
      let newBoard = playerMove(i, boardState, 1);
      let currScore = miniMax(newBoard, false, 5);
      console.log(currScore)
      if (currScore > bestScore) {
        bestScore = currScore;
        bestMove = i;
      }
    }
    // console.log("Best score: ",bestScore, "Best move: ", bestMove);
    console.log('best move returns:', bestMove)
    return bestMove;
  }
  function miniMax(board, isMaxismizing, depth){
    // console.log('called miniMax')
    if (isGameOver(board)){
      let score = scoreGame(board);
      if (score === "Player 1 won") return -Infinity;
      if (score === "Player 2 won") return Infinity;
    }
    if (depth === 0){
      return board[13] - board[6];
    }
    if (isMaxismizing){
      // console.log("Maximizing at depth ", depth);
      let bestScore = -Infinity;
      for (let i=0; i<board.length; i++){
        if (i === 6 || i === 13) continue;
        if (board[i] === 0) continue;
        let newBoard = playerMove(i, board, 1);
        let currScore = miniMax(newBoard, false, depth-1);
        if (currScore > bestScore){
          bestScore = currScore
        }
      }
      return bestScore
    } else {
      // console.log("Minimizing at depth ", depth);

      let bestScore = Infinity;
      for (let i=0; i<board.length; i++){
        if (i === 6 || i === 13) continue;
        if (board[i] === 0) continue;
        let newBoard = playerMove(i, board, 0);
        let currScore = miniMax(newBoard, true, depth - 1);
        if (currScore < bestScore) {
          bestScore = currScore
        }
      }
      return bestScore;
    }
  } 

  useEffect(() => {
    if (isGameOver() === true) setTimeout(alert(scoreGame(), 0));
    if (state.turnCounter === 1){
      setTimeout(()=>resetState(findBestMove()), 2000 )
    }
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
