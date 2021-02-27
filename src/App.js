import logo from './logo.svg';
import './css/style.min.css';
import './js/scripts.min';
import React, {Component} from 'react'

class HelloMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({
      active: !this.state.active
    });
    console.log("click");
  }

  render() {
    return (
      <div>
        Привет, <span className={"class" + (this.state.active ? ' active': "")} onClick={this.handleClick}>{this.props.name}</span>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <HelloMessage  name="Кирилл"/>
          <HelloMessage  name="Саня"/>
        </header>
      </div>
    );
  }
}

export default App;
