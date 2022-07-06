import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom/client';
import Autocomplete from './Autocomplete.js';
import {Guesses, GuessesHeader}  from './Guesses.js';
import './styles/style.css';

const StatsButton = () =>{
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (<>
      <span onClick={handleShow}>STATS</span>
      <Modal show={show} onHide={handleClose} centered dialogClassName="statsmodal">
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      </Modal>
      </>
  );
}

const HelpButton = () =>{
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (<>
      <span onClick={handleShow}>HELP</span>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      </Modal>
      </>
  );
}

const GameOver = (props) =>{
  const [show, setShow] = useState(localStorage.gameOver === 'true');
  let modalShown=false;
  const handleClose = () => {
      modalShown=true;
      setShow(false);
      
  }

  useEffect(()=>{ 
    if (localStorage.gameOver==='true'&&modalShown===false)
        setShow(true);
  },[localStorage.gameOver]);

  const shareScore = () =>{
    let copyText = 'ESPORTLE ' +  + '/8' + '\n\n';
    for (let i=0;i<JSON.parse(localStorage.guesses).length;i++)
	  {
		for (let j=0; j<6;j++)
		{
			if (document.getElementsByClassName("guess")[i].getElementsByClassName("text-block")[j].style.backgroundColor === "rgb(250, 178, 77)")
				copyText += "🟩";
			else if (document.getElementsByClassName("guess")[i].getElementsByClassName("text-block")[j].style.backgroundColor === "rgb(62, 67, 112)")
				copyText += "🟨";
			else
				copyText+= "⬛";
		  }
		copyText +="\n";
	}
  navigator.clipboard.writeText(copyText); 
  }

  return (<>
      <Modal show={show} onHide={handleClose} centered dialogClassName="gameovermodal">
        <Modal.Body>
        <img src={'https://prosettings.net/acd-cgi/img/v1/wp-content/uploads/' + props.answer.name.toLowerCase() + '.png'} alt='avatar'></img><br/>
        <span>{(localStorage.currentStreak === '0')? 'NT!' : 'GG WP!'}</span><br/>
        <span>THE RIGHT ANSWER WAS <br/>{props.answer.fullname}</span><br/>
        <span>{(localStorage.currentStreak === '0')? 'GL HF TOMORROW!' : 'YOU SOLVED IT IN ' + JSON.parse(localStorage.guesses).length + ' GUESS' 
        + (JSON.parse(localStorage.guesses).length===1? '!' : 'ES!')
        }</span><br/>
        <button onClick={shareScore}>SHARE MY RESULT!</button>
        </Modal.Body>
      </Modal>
      </>
  );
}


const TopBar = () => {
  return (
    <div className='top-bar'>
      <StatsButton/>
      <HelpButton/>
    </div>
  );

}

const ImageLink = (props) =>
{
  return (
    <a href={props.href}><img src={props.src} id={props.id} alt={props.alt}></img></a>
  )
}

const BottomBar = () => {
  return <div className="bottom-bar">
    <ImageLink 
    href={"https://discordapp.com/users/140721278695768064/"}
    src={"https://upload.wikimedia.org/wikipedia/commons/9/9f/Discord_icon.svg"}
    id={"discord"}
    alt={"discord"}
    >  
    </ImageLink>
  </div>
}

const Input = (props) =>{
    let playernames = [];
    for (let i=0; i< props.players.length; i++)
      playernames.push(props.players[i].fullname);

    return (
    <div className="autocomplete"><Autocomplete update={props.update} suggestions={playernames}/></div>
    );
  
}

const GameTitle = () => {
  return <div className="gametitle">ESPORTLE</div>;
}

class Game extends React.Component {
  update = () =>{
    this.setState({});
    let lastAnswer=JSON.parse(localStorage.guesses)[JSON.parse(localStorage.guesses).length-1];
    if (JSON.parse(localStorage.guesses).length===8 || lastAnswer === this.props.players[this.props.answer].fullname)
        {
          localStorage.gameOver=true;
          localStorage.currentStreak = (lastAnswer===this.props.players[this.props.answer].fullname)? parseInt(localStorage.currentStreak)+1 : 0;
          localStorage.maxStreak = (parseInt(localStorage.currentStreak)>parseInt(localStorage.maxStreak))? parseInt(localStorage.currentStreak) : localStorage.maxStreak;
          localStorage.gamesplayed = parseInt(localStorage.gamesplayed)+1;
          localStorage.gameswon = (lastAnswer===this.props.players[this.props.answer].fullname)? parseInt(localStorage.gameswon+1) : localStorage.gameswon;
        }
  }

  render() {
    
    return (<>
      <TopBar/>
      <div className="maingame">
        <GameOver answer={this.props.players[this.props.answer]}/>
        <GameTitle/>
        <Input update={this.update} players={this.props.players}></Input>        {/*INPUT ELEMENT*/}
        <GuessesHeader />
        <Guesses answer={this.props.answer} players={this.props.players}/>
        <BottomBar />
      </div>
      </>
    );
  }

}

// ========================================
if (localStorage.length === 0){
  localStorage.guesses = JSON.stringify([]);
  localStorage.gameOver = false;
  localStorage.gamesplayed = 0;
  localStorage.gameswon=0;
  localStorage.currentStreak=0;
  localStorage.maxStreak=0;
}

localStorage.modalShown=false;

let playersdata;
fetch('players.json')
.then(response=>response.text())
.then(data=>{
  playersdata = JSON.parse(data);
  fetch('win.txt')
  .then (response=>response.text())
  .then (data => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<Game answer={data} players={playersdata} />);
  })
});

export default Game;
