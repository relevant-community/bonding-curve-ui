import React, { Component } from 'react';
import './App.css';
import BondedToken from './BondedToken.js'

class App extends Component {
  render() {
    return (
      <div className="App">
{/*        <BondedToken address="0xf25186b5081ff5ce73482ad761db0eb0d25abfbf"/>*/}
        <BondedToken />
      </div>
    );
  }
}

export default App;
