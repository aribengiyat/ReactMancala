import './App.css';

function App() {
  return (
    <div className="App">
      <Board/>
    </div>
  )
}
function Board(){
  //here we need to give this component a state that we can pass down to the store and pocket components through "props".

  let boardComponents = []; //we will put all the board components in this array.

  boardComponents.push(<Store key="player-2-store" class="player-2-store"/>);
  for (let i=0; i<6; i++){
    boardComponents.push(<Pocket key={`player-2-pocket-${i}`} class={`player-2-pocket-${i}`}/>);
  }
  boardComponents.push(<Store key="player-1-store" class="player-1-store"/>);
  for (let i=0; i<6; i++){
    boardComponents.push(<Pocket key={`player-1-pocket-${i}`} class={`player-1-pocket-${i}`}/>);
  }

  

  return(
    <div className="board-grid">
      {boardComponents};
    </div>
  )
}

function Store(props){
  return (
    //the state that is passed down from Board will give the inner text to this div (it will go in between the tags). ie the number of marbles it holds. same for pocket below.
    <div className={props.class+ ' store'} >
    </div>
  )
}

function Pocket(props){
  return (
    <div className={props.class+' pocket'}>
    </div>
  )
}

export default App;
