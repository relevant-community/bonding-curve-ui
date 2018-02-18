import Switch  from 'react-flexible-switch';
import CurveChart from './Chart';
var React = require('react');

class BondedTokenAdvanced extends React.Component {

  render() {
    return (
      <div className=" --BondedTokenAdvanced">
        <div className=" --bondedToken-flex-center">
          <Switch
          switchStyles={{width: 110}}
          value={this.props.advanced}
          circleStyles={{diameter: 16, onColor: 'grey', offColor: 'lightgrey'}} 
          labels={{on: 'Advanced', off: 'Advanced'}}
          onChange={event => this.props.toggleAdvanced()} />
        </div>
        {this.props.advanced && (
        <div className=" --BondedTokenAdvanced-open">

          <div className="--bondedToken-flex --bondedTokenTransact">
            <div>Pool Balance</div>
            <div>
              <label className="--bondedToken-eth">
                <input
                  readOnly={!!this.props.address}
                  type="number"
                  value={this.props.balance}
                  max={this.props.bigMax}
                  onChange={event => this.props.onChange(event, 'balance')} />
              </label>
              {!this.props.address && (
              <input 
                type="range"
                value={this.props.balance}
                max={this.props.bigMax}
                onChange={event => this.props.onChange(event, 'balance')} /> )}
            </div>
          </div>        

          <div className="--bondedToken-flex --bondedTokenTransact">
            <div>Ratio</div>
            <div>
              <label className="--bondedToken-ratio">
                <input
                  readOnly={!!this.props.address}
                  type="number"
                  step="0.01"
                  max="1"
                  min="0"
                  value={this.props.ratio}
                  onChange={event => this.props.onChange(event, 'ratio')} />
              </label>
              {!this.props.address && (
              <input 
                type="range"
                value={this.props.ratio}
                max="1"
                step="0.01"
                onChange={event => this.props.onChange(event, 'ratio')} /> )}
            </div>
          </div>

          <div className="--bondedToken-flex --bondedTokenTransact">
            <div>Total Supply</div>
            <div>
              <label className="--bondedToken-token">
                 <input
                    readOnly={!!this.props.address}
                    type="number"
                    value={this.props.totalSupply}
                    max={this.props.bigMax}
                    onChange={event => this.props.onChange(event, 'totalSupply')} />
              </label>
              {!this.props.address && (
              <input 
                type="range"
                value={this.props.totalSupply}
                max={this.props.bigMax} 
                onChange={event => this.props.onChange(event, 'totalSupply')} /> )}
            </div>
          </div>
          <CurveChart data={this.props.getDataPool()}/> : null}
        </div>
        )}
      </div>
    );
  }

};

export default BondedTokenAdvanced;