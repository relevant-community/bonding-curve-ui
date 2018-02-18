import React, { Component } from 'react';
import './App.css';
import BondedToken from './BondedToken.js'

class App extends Component {
  render() {
    let w = true
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Welcome to Relevant's Bonded Curve Token</h3>
        <div style={{
          'maxWidth' : '480px',
          'margin' : '80px auto 80px auto',
          }}>
          <div className="App">
            {w ? <BondedToken relevant={true} /> : <BondedToken />}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
