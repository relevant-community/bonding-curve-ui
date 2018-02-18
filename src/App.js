import React, { Component } from 'react';
import './App.css';
import BondedToken from './BondedToken.js'

class App extends Component {
  render() {
    let w = true
    return (
      <div className="App">
        {w ? <BondedToken relevant={true} /> : <BondedToken />}
      </div>
    );
  }
}

export default App;
