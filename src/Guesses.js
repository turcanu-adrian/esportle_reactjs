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
    <GuessesHeaderCell value={"HLTV RATING"}></GuessesHeaderCell>
    <GuessesHeaderCell value={"NAME"}></GuessesHeaderCell>
    </div>
  );
}

const GuessBlock = (props) =>
{ 
  return <div style={props.style} className='text-block'><span><img src={props.img} alt=''/>{props.text}</span></div>
 
}


const Guess = (props)=>{
  return (<div className="guess">
    <GuessBlock 
      style=
      {{
        backgroundColor: (props.data.currentTeam===props.answer.currentTeam)? '#fab24d' : (props.answer.pastTeams.includes(props.data.currentTeam)? '#3e4370' : null),
        color: (props.data.currentTeam === props.answer.currentTeam)? null : (props.answer.pastTeams.includes(props.data.currentTeam)? 'white' : null),
      }}
      text={props.data.currentTeam} 
      img={team_logos[props.data.currentTeam + '.png']}
    />
    <GuessBlock 
      text={props.data.continent}
      style=
      {{
        backgroundColor: (props.data.continent===props.answer.continent)? '#fab24d' : null,
        color: (props.data.continent===props.answer.continent)? null: null,
      }}
    />
    <GuessBlock 
      text={props.data.country}
      style=
      {{
        backgroundColor: (props.data.country===props.answer.country)? '#fab24d' : null,
       //color: (props.data.country==props.answer.country)? 'white' : null,
      }}
    />
    <GuessBlock 
      text=
      {props.data.earnings.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits: '0'})  + ((Math.abs(props.data.earnings-props.answer.earnings)<=50000 && props.data.earnings!==props.answer.earnings)? ((props.data.earnings>props.answer.earnings)? "\n▼" : "\n▲"): '')}
      style=
      {{
        backgroundColor: (props.data.earnings===props.answer.earnings)? '#fab24d' : (Math.abs(props.data.earnings-props.answer.earnings)<=50000)? '#3e4370' : null,
        color: (props.data.earnings===props.answer.earnings)? null : (Math.abs(props.data.earnings-props.answer.earnings)<=50000)? 'white' : null,
      }}
    />
    <GuessBlock 
      text={props.data.age + ((Math.abs(props.data.age-props.answer.age)<=2 && props.data.age!==props.answer.age)? ((props.data.age>props.answer.age)? "\n▼" : "\n▲"): '')}
      style=
      {{
        backgroundColor: (props.data.age===props.answer.age)? '#fab24d' : (Math.abs(props.data.age-props.answer.age)<=2)? '#3e4370' : null,
        color: (props.data.age===props.answer.age)? null : (Math.abs(props.data.age-props.answer.age)<=2)? 'white' : null,
      }}

    />
    <GuessBlock 
      text={props.data.rating + '\n' + ((Math.abs(props.data.rating-props.answer.rating)<=0.05 && props.data.rating!==props.answer.rating)? ((props.data.rating>props.answer.rating)? "▼" : "▲"): '')}
      style=
      {{
        backgroundColor: (props.data.rating===props.answer.rating)? '#fab24d' : (Math.abs(props.data.rating-props.answer.rating)<=0.05)? '#3e4370' : null,
        color: (props.data.rating===props.answer.rating)? null : (Math.abs(props.data.rating-props.answer.rating)<=0.05)? 'white' : null,
      }}
    />
    <GuessBlock 
      text={props.data.fullname}
      style=
      {{
        backgroundColor: (props.data.fullname===props.answer.fullname)? '#fab24d ' : null,
       //color: (props.data.fullname==props.answer.fullname)? 'white' : null,
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