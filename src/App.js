import './App.css';

function App() {
  return (
    <div className="App">
      <Board/>
    </div>
  )
}
function Board(){
  let boardComponents = [];
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
