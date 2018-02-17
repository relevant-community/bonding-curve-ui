import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import BondedToken from './BondedToken.js'
// import Fancy from 'bonded-token';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BondedToken address="0xfb88de099e13c3ed21f80a7a1e49f8caecf10df6"/>
      </div>
    );
  }
}

export default App;
