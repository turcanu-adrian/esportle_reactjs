import React, {Fragment} from 'react';


class Autocomplete extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {

          activeSuggestion: 0,
          filteredSuggestions: [],
          showSuggestions: false,
          userInput: ""
        };
    }

    onChange = e => { 
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;
    
        const filteredSuggestions = suggestions.filter(
            suggestion =>
            (suggestion.split('"')[1].toLowerCase().indexOf(userInput.toLowerCase()) > -1)  && (!JSON.parse(localStorage.guesses).includes(suggestion))
        );
    
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    };

    onClick = e => {
        const { activeSuggestion, filteredSuggestions} = this.state;
         let guess = e.currentTarget.innerText;
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: [],
          showSuggestions: false,
          userInput: ''
        });
        if (guess!=null)
          this.addGuess(guess);
      };

      onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions} = this.state;
        if (e.keyCode === 13) { 
            let guess = filteredSuggestions[activeSuggestion];
            this.setState({
                filteredSuggestions:[],
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: ''
            });
            if (guess!=null )
              this.addGuess(guess);
        } else if (e.keyCode === 38) {
          if (activeSuggestion === 0) {
            return;
          }
          this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
          if (activeSuggestion - 1 === filteredSuggestions.length) {
            return;
          }
          this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
      };

      addGuess(guess)
      { 
        let guesses = JSON.parse(localStorage.guesses);
        guesses.push(guess);
        localStorage.guesses = JSON.stringify(guesses); 
        this.props.update();
      }

      render() {
        const {
          onChange,
          onClick,
          onKeyDown,
          state: {
            activeSuggestion,
            filteredSuggestions,
            showSuggestions,
            userInput
          }
        } = this;
    
        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
              suggestionsListComponent = (
                <div className="autocomplete-items">
                  {filteredSuggestions.map((suggestion, index) => {
                    let className;
      
                    // Flag the active suggestion with a class
                    if (index === activeSuggestion) {
                      className = "autocomplete-active";
                    }
                    return (
                      <div className={className} key={suggestion} onClick={onClick}>
                        {suggestion}
                      </div>
                    );
                  })}
                </div>
              );
            }
          }

          return (
            <Fragment>
              <input
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                id={"inputbox"}
                disabled={(localStorage.gameOver==='true')? true : false}
                autoComplete="off"
              />
              {suggestionsListComponent}
            </Fragment>
          );
        }
    }
    
export default Autocomplete;
    