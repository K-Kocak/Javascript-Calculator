import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
//import App from './App';
//import reportWebVitals from './reportWebVitals';


// two regexs
const operators = /[\x+-/]/;
const numbers = /[1-9]/;

class App extends React.Component {
	render() {
		return (
			<div>
        <Calculator />
        <Author />
			</div>
		)
	}
}

class Author extends React.Component {
  render() {
    return (
    <div class="author">
    </div>
      )
  }
}

class Calculator extends React.Component {
  constructor(props){
    super(props);   
    this.state = {
      orangeDisplay: "",
      display: "0",
      lastInput: "",
      prevAnswer: ""
    }  
    this.clearButton = this.clearButton.bind(this);
    this.numberPressed = this.numberPressed.bind(this);
    this.operatorPressed = this.operatorPressed.bind(this);
    this.handleZero = this.handleZero.bind(this);
    this.dotPressed = this.dotPressed.bind(this);
    this.minusOperatorPressed = this.minusOperatorPressed.bind(this);
    this.solveEquation = this.solveEquation.bind(this);
    this.handleNewEquation = this.handleNewEquation.bind(this);
  }

  // resets states to default values
  clearButton() {
    const clearContents = ["", "0", ""];
    this.setState({
      orangeDisplay: clearContents[0],
      display: clearContents[1],
      lastInput: clearContents[2],   
    })
  }
  
  // #1 if a number is pressed, we first check if the equals sign was just pressed. if it was, we call clearButton, then set the values of all our states to the number that was pressed
  numberPressed(event) {
    if(this.state.lastInput === "=") {
      this.clearButton();
      this.setState({
        display: event.target.value,
        orangeDisplay: event.target.value,
        lastInput: event.target.value
      })
      return;
    }
    //console.log(this.state.orangeDisplay);
    // #2 alternatively, if the last input was an operator, we set the white text color display to equal the number that was pressed.
    if(operators.test(this.state.lastInput) && !this.state.display.includes(".")) {

        this.setState({
          display: event.target.value
        });       
    } 
    else {
      // if an operator was not the last input, that means a number must be the last input
      // we check if the display right now shows just a zero, if it does we want to overwrite this zero with the number inputted
      // furthermore, we want to remove this 0 from the orange display aswell
        if(this.state.display === "0" && !this.state.lastInput.includes(".")) {
          const orangeDisplayLength = this.state.orangeDisplay.length;
          const updateOrangeDisplay = this.state.orangeDisplay.slice(0, orangeDisplayLength - 1) + event.target.value;
          this.setState({
            display: event.target.value,
            orangeDisplay: updateOrangeDisplay,
            lastInput: event.target.value
          });
          return;
          // in the event the input doesnt display a 0, yet a number was the last input, we simply concat the number pressed to the white display
        } else {            
           this.setState({
          display: this.state.display.concat(event.target.value)
          });    
        }         
    }   
   
    // if the orange display is a 0, we overwrite it with the number inputted
    if(this.state.orangeDisplay === "0") {
      this.setState({
        orangeDisplay: event.target.value
      })
      // if the orange display isnt a 0, we just concat the number pressed to orange display
    } else {
      this.setState({
      orangeDisplay: this.state.orangeDisplay.concat(event.target.value),
      });
    }
  
    
    // setting last input entered to be the number that was pressed
    this.setState({
      lastInput: event.target.value
    })

  }

  // function called if 0 is pressed, we check if = was pressed last, if it was we just reset all states to default value and nothing else
  handleZero(event) {
    if(this.state.lastInput === "=") {
      this.clearButton();
      return;
    }

     // if we press 0 when 0 is displayed on the white display, we ask if orange display is currently displaying an empty string, if it is, we concat 0 to it, else we do nothing
    // we set last input to 0 also, and nothing else
    if(this.state.display === "0") {

      this.setState({
        orangeDisplay: this.state.orangeDisplay === "" ? "0" : this.state.orangeDisplay,
        lastInput: "0"
      });
      return;
    }

    // if the last input was a regular number, or if we've pressed the decimal point at some point on this number, we just concat 0 to our displays
    if(numbers.test(this.state.lastInput) || this.state.lastInput === ".") {

      this.setState({
        display: this.state.display.concat("0"),
        orangeDisplay: this.state.orangeDisplay.concat("0"),
        lastInput: "0"
      });
      return;
    }

    
    //if the last input was a 0 and theres a decimal point at some point, we allow more 0s to be concat to the display
    if(this.state.lastInput === "0" && this.state.display.includes(".")) {

      this.setState({
        display: this.state.display.concat("0"),
        orangeDisplay: this.state.orangeDisplay.concat("0"),
        lastInput: "0"
      });
      return;
    }
  
    // if the last input was an operator, we concat orange display + display with a zero
    if(operators.test(this.state.lastInput)) {
      this.setState({
        display: "0",
        orangeDisplay: this.state.orangeDisplay.concat("0"),
        lastInput: "0"
      })
    }  
  }
  
  
  // function triggered by the decimal point, if the last state was an =, we update the displays appropriately
  dotPressed() {
    if(this.state.lastInput === "=") {
      this.setState({
        display: "0.",
        orangeDisplay: "0.",
        lastInput: "."
      });
      return;
    }
    
    // if the current number has a decimal point, do nothing and exit the function
    if(this.state.display.includes('.')) {
      return;
      // if the last input was an operator, change displays to appropriate string values
    } else if(operators.test(this.state.lastInput)) {
      this.setState({
        display: "0.",
        orangeDisplay: this.state.orangeDisplay.concat("0."),
        lastInput: "."
      })
      return;
      // at this point, a number must have been the last input and no decimal point exists in the current nubmer yet, so we just concat decimal point, however if the orange display is currently empty, we make sure its set to 0.
    } else {      
      this.setState({
        display: this.state.display.concat("."),
        orangeDisplay: this.state.orangeDisplay === "" ? "0." : this.state.orangeDisplay.concat("."),
        lastInput: "."
      })
    }
  }

  // function called for divide, multiply and add
  // if the last input was an =, we call handleNewEquation with the operator we pressed (meaning we set display to the operator and orange display equaled to the answer from the previous equation + the operator pressed)
  operatorPressed(event) {
    if(this.state.lastInput === "="){
      this.handleNewEquation(event);
      return;
    }
    // if orange display is blank, dont allow the user to press an operator
    if(this.state.orangeDisplay === "")  {
      return;
    }
    
    // if the last input was an operator, we change display to the new operator pressed. for orange display, we cut away the space occupied by the last operator and concat the new operator
    if(operators.test(this.state.lastInput) && this.state.lastInput !== ".") {
      this.setState({
        display: event.target.value,
        orangeDisplay: this.state.orangeDisplay.slice(0, this.state.orangeDisplay.length - this.state.lastInput.length) + event.target.value,
        lastInput: event.target.value
      });
      return;
    }
    // if the last state pressed was a decimal...
    if(this.state.lastInput === ".") {
      // if orange display equals diplay, we set display to the operator and orange display to 0 + operator
      if(this.state.orangeDisplay === this.state.display) {
        this.setState({
          display: event.target.value,
          orangeDisplay: "0" + event.target.value,
          lastInput: event.target.value
        });
      } else {
        // here, we have a decimal point as last input and we pressed an operator. we want to delete the current number from display and delete the appropriate amount from orange display, as done before
        this.setState({
          display: event.target.value,
          orangeDisplay: this.state.orangeDisplay.slice(0, this.state.orangeDisplay.length - this.state.display.length - 1) + event.target.value,
          lastInput: event.target.value
      });       
      }
      return;     
    }
    // if the function hasnt returned yet, we simply concat the operator to orange display, and set display to the operator pressed
    this.setState({
      display: event.target.value,
      orangeDisplay: this.state.orangeDisplay.concat(event.target.value),
      lastInput: event.target.value
    });
    
  }
  
  
  // as the function name implies, this is for the minus operator
  // this is similar to the regular operator function, but we allow a minus to chain with a divide, multiply and a divide operator (for negative numbers)
  minusOperatorPressed(event) {
    if(this.state.lastInput === "="){
      this.handleNewEquation(event);
      return;
    }
    if(this.state.orangeDisplay === "")  {
      return;
    }  
    if(operators.test(this.state.lastInput) && this.state.lastInput !== ".") {
      if(this.state.lastInput.length === 1) {
        // here, if an operator was the last input and we press the minus operator, it will concat the minus operator, but also set last input to the last operator plus the minus operator.
          this.setState({
            display: "-",
            orangeDisplay: this.state.orangeDisplay.concat("-"),
            lastInput: this.state.lastInput + "-"
          });
        } 
       return;
      }

    if(this.state.lastInput === ".") {

      if(this.state.orangeDisplay === this.state.display) {
        this.setState({
          display: event.target.value,
          orangeDisplay: "0" + event.target.value,
          lastInput: event.target.value
        });
      } else {

        this.setState({
          display: event.target.value,
          orangeDisplay: this.state.orangeDisplay.slice(0, this.state.orangeDisplay.length - this.state.display.length - 1) + event.target.value,
          lastInput: event.target.value
      });       
      }
      return;   
    }
    
    this.setState({
        display: "-",
        orangeDisplay: this.state.orangeDisplay.concat("-"),
        lastInput: "-"
      });
  }
  
  
  // solves whatever the string is in orange display when equals is pressed, we use the eval function for this, then set states as appropriate, using prevAnswer state for when the user wishes to continue the equation
  solveEquation() {
    console.log(this.state.orangeDisplay);
    const fixMultiply = this.state.orangeDisplay.replace("x", "*");
    const fixMinus = fixMultiply.replace("--", "+");
    let answer = eval(fixMinus);
    
    let stringAnswer = answer.toString();
    console.log(stringAnswer);
    this.setState({
      display: stringAnswer,
      orangeDisplay: this.state.orangeDisplay.concat("=", stringAnswer),
      //orangeDisplay: stringAnswer,
      lastInput: "=",
      prevAnswer: stringAnswer
    });
  }
  
  
  // if an operator is pressed after pressing equals, we trigger this function
  handleNewEquation(event) {
    this.setState({
      display: event.target.value,
      orangeDisplay: this.state.prevAnswer + event.target.value,
      lastInput: event.target.value
    })
  }
  
  render() {
    return (
      <div class="calculator">
        <div class="formulaScreen">{this.state.orangeDisplay}</div>
        <div class="outputScreen" id="display">{this.state.display}</div>
        <div>
          <button class="jumbo" id="clear" value="AC" onClick={this.clearButton}>AC</button>
          <button id="divide" value="/" onClick={this.operatorPressed}>/</button>
          <button id="multiply" value="x" onClick={this.operatorPressed}>x</button>
          <button id="seven" value="7" onClick={this.numberPressed}>7</button>
          <button id="eight" value="8" onClick={this.numberPressed}>8</button>
          <button id="nine" value="9" onClick={this.numberPressed}>9</button>
          <button id="subtract" value="-" onClick={this.minusOperatorPressed}>-</button>
          <button id="four" value="4" onClick={this.numberPressed}>4</button>
          <button id="five" value="5" onClick={this.numberPressed}>5</button>
          <button id="six" value="6" onClick={this.numberPressed}>6</button>
          <button id="add" value="+" onClick={this.operatorPressed}>+</button>
          <button id="one" value="1" onClick={this.numberPressed}>1</button>
          <button id="two" value="2" onClick={this.numberPressed}>2</button>
          <button id="three" value="3" onClick={this.numberPressed}>3</button>
          <button class="jumbo" id="zero" value="0" onClick={this.handleZero}>0</button>
          <button id="decimal" value="." onClick={this.dotPressed}>.</button>
          <button id="equals" value="=" onClick={this.solveEquation}>=</button>
        </div>
      </div>
    )
  }
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
