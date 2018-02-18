import React, { Component } from 'react';
import './App.css';
import BondedToken from './BondedToken.js'

class App extends Component {
  render() {
    // let address = '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf';
    let address = '';
    return (
      <div className="App">
        <BondedToken address={address}/>
      </div>
    );
  }
}

export default App;
