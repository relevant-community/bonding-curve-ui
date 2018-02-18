import React, { Component } from 'react';
import './App.css';
import BondedToken from './BondedToken.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<BondedToken address="0xfb88de099e13c3ed21f80a7a1e49f8caecf10df6"/>*/}
        <BondedToken />
      </div>
    );
  }
}

export default App;
