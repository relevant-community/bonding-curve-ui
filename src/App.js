import React, { Component } from 'react';
import './App.css';
import BondedToken from 'bonded-token'

class App extends Component {
  render() {
    let w = true
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Welcome to <a rel="noopener noreferrer" href="https://relevant.community" target="_blank">Relevant</a>'s Bonded Curve Token Contract</h3>
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
