import React from 'react';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const team_logos = importAll(require.context('./team-logos', false, /\.(png|jpe?g|svg)$/));


const GuessesHeaderCell = (props) =>{
  return (
    <div className="guessesheader-cell"><span>{props.value}</span></div>
  );
}

const GuessesHeader = () =>{
  return (<div className="guessesheader">
    <GuessesHeaderCell value={"TEAM"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"REGION"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"COUNTRY"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"EARNINGS"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"AGE"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"RATING"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"NAME"}></GuessesHeaderCell>
    </div>
  );
}

const GuessBlock = (props) =>
{ 
  return <div style={props.style} className='text-block'><img src={props.img} alt=''/><span>{props.text}</span></div>
 
}


const Guess = (props)=>{
  let guessIndex = JSON.parse(localStorage.guesses).length;

  return (<div className="guess">
    <GuessBlock 
      style=
      {{
        filter: (props.data.currentTeam===props.answer.currentTeam || props.answer.pastTeams.includes(props.data.currentTeam))? 'brightness(120%)' : null,
        backgroundColor: (props.data.currentTeam===props.answer.currentTeam)? '#466571' : (props.answer.pastTeams.includes(props.data.currentTeam)? 'rgb(108, 94, 40)' : null),
        color: (props.data.currentTeam === props.answer.currentTeam)? '#bde2fb' : null,
      }}
      text={'\n'+props.data.currentTeam} 
      img={team_logos[props.data.currentTeam + '.png']}
    />
    <GuessBlock 
      text={props.data.continent}
      style=
      {{
        filter: (props.data.continent===props.answer.continent)? 'brightness(120%)' : null,
        backgroundColor: (props.data.continent===props.answer.continent)? '#466571' : null,
        color: (props.data.continent===props.answer.continent)? '#bde2fb': null,
      }}
    />
    <GuessBlock 
      text={props.data.country}
      style=
      {{
        filter: (props.data.country===props.answer.country)? 'brightness(120%)' : null,
        backgroundColor: (props.data.country===props.answer.country)? '#466571' : null,
        color: (props.data.country==props.answer.country)? '#bde2fb' : null,
      }}
    />
    <GuessBlock 
      text=
      {(props.data.earnings/1000).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits: '0'}) +'k' + ((Math.abs(props.data.earnings-props.answer.earnings)<=50000 && props.data.earnings!==props.answer.earnings)? ((props.data.earnings>props.answer.earnings)? " ▼" : " ▲"): '')}
      style=
      {{
        filter: (Math.abs(props.data.earnings-props.answer.earnings)<=50000)? 'brightness(120%)' : null,
        backgroundColor: (props.data.earnings===props.answer.earnings)? '#466571' : (Math.abs(props.data.earnings-props.answer.earnings)<=50000)? 'rgb(108, 94, 40)' : null,
        color: (props.data.earnings===props.answer.earnings)? '#bde2fb' : null,
      }}
    />
    <GuessBlock 
      text={props.data.age + ((Math.abs(props.data.age-props.answer.age)<=2 && props.data.age!==props.answer.age)? ((props.data.age>props.answer.age)? " ▼" : " ▲"): '')}
      style=
      {{
        filter: (Math.abs(props.data.age-props.answer.age)<=2)? 'brightness(120%)' : null,
        backgroundColor: (props.data.age===props.answer.age)? '#466571' : (Math.abs(props.data.age-props.answer.age)<=2)? 'rgb(108, 94, 40)' : null,
        color: (props.data.age===props.answer.age)? '#bde2fb':null,
      }}

    />
    <GuessBlock 
      text={props.data.rating  + ((Math.abs(props.data.rating-props.answer.rating)<=0.05 && props.data.rating!==props.answer.rating)? ((props.data.rating>props.answer.rating)? " ▼" : " ▲"): '')}
      style=
      {{
        filter: (Math.abs(props.data.rating-props.answer.rating)<=0.05)? 'brightness(120%)' : null,
        backgroundColor: (props.data.rating===props.answer.rating)? '#466571' : (Math.abs(props.data.rating-props.answer.rating)<=0.05)? 'rgb(108, 94, 40)' : null,
        color: (props.data.rating===props.answer.rating)? '#bde2fb' : null,
        }}
      />
    <GuessBlock 
      text={props.data.fullname}
      style=
      {{
        filter: (props.data.fullname===props.answer.fullname)? 'brightness(120%)' : null,
        backgroundColor: (props.data.fullname===props.answer.fullname)? '#466571' : null,
        color: (props.data.fullname==props.answer.fullname)? '#bde2fb' : null,
      }}
      />
  </div>)
}

const Guesses = (props) => {
  let guesses = JSON.parse(localStorage.guesses);
  let guessesComponent = guesses.map((guessname, index) =>
  {
    return <Guess 
    key={index} 
    data={props.players.find(obj => {return obj.fullname === guessname})}
    answer={props.players[props.answer]}
    />
  });
  return <div className="guesses">{guessesComponent}</div>  
}


export {Guesses, GuessesHeader, GuessesHeaderCell}