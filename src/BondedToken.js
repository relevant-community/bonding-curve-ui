import React from 'react';
import RelevantCoin from './relevant-contracts/dapp-module/RelevantCoin/index.js'
import './BondedToken.css';
import Switch  from 'react-flexible-switch';
import {Decimal} from 'decimal.js';
var BigNumber = require('bignumber.js');
const Web3 = require('web3')
const ZeroClientProvider = require('web3-provider-engine/zero.js')

class BondedToken extends React.Component {
  render() {

    return (
      <div className="--bondedToken">
        {this.state.loading && (
          <div>LOADING</div>
        )}
        <div className="--bondedToken-flex">
          <Switch
          switchStyles={{width: 60}}
          value={this.isBuy}
          circleStyles={{diameter: 16, onColor: 'grey', offColor: 'grey'}} 
          labels={{on: 'Sell', off: 'Buy'}}
          onChange={event => this.toggleBuy()}
          />
        </div>

        <div className="--bondedToken-flex --bondedToken-mx-auto">
          <div>
            <h2>Balance</h2>
            <label className="--bondedToken-eth">
              <input
                readOnly={!!this.props.address}
                type="number"
                value={this.state.balance}
                max={this.bigMax}
                onChange={event => this.onChange(event, 'balance')} />
            </label>
            {!this.props.address && (
            <input 
              type="range"
              value={this.state.balance}
              max={this.bigMax}
              onChange={event => this.onChange(event, 'balance')} /> )}
           
          </div>


          <div>
            <h2>Ratio</h2>
            <label className="--bondedToken-ratio">
            <input
              readOnly={!!this.props.address}
              type="number"
              step="0.01"
              max="1"
              min="0"
              value={this.state.ratio}
              onChange={event => this.onChange(event, 'ratio')} />
            </label>
            {!this.props.address && (
            <input 
              type="range"
              value={this.state.ratio}
              max="1"
              step="0.01"
              onChange={event => this.onChange(event, 'ratio')} /> )}
          </div>

          <div>
            <h2>Total Supply</h2>
            <label className="--bondedToken-token">
              <input
                readOnly={!!this.props.address}
                type="number"
                value={this.state.totalSupply}
                max={this.bigMax}
                onChange={event => this.onChange(event, 'totalSupply')} />
            </label>
            {!this.props.address && (
            <input 
              type="range"
              value={this.state.totalSupply}
              max={this.bigMax} 
              onChange={event => this.onChange(event, 'totalSupply')} /> )}
          </div>
          
        </div>


        <div className="--bondedToken-flex">
          <div>
            <h2>Amount</h2>
            <label className={this.state.isBuy ? "--bondedToken-eth" : "--bondedToken-token"}>
              <input
                type="number"
                max={this.state.isBuy ? (this.props.address ? this.state.walletBalance : this.bigMax) : (this.props.address ? this.state.tokenBalance : this.state.totalSupply)}
                value={this.state.amount}
                onChange={event => this.onChange(event, 'amount')} />
            </label>
            <br/>
            <input 
              type="range"
              max={this.state.isBuy ? (this.props.address ? this.state.walletBalance : this.bigMax) : (this.props.address ? this.state.tokenBalance : this.state.totalSupply)}
              value={this.state.amount}
              onChange={event => this.onChange(event, 'amount')} /> 
          </div>
        </div>
        <div>
          <label className={this.state.isBuy ? "--bondedToken-token" : "--bondedToken-eth"}>
            {this.state.isBuy ? this.calculatePurchaseReturn() : this.calculateSaleReturn()}
          </label>
        </div>
        <div>
          <input
            type="submit"
            onClick={event => this.submit()} />     
        </div>
        <pre style={{'textAlign':'left'}}>
        {JSON.stringify(this.state).split(',').join(',\n')}
        </pre>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.relevantCoin = new RelevantCoin({address: props.address})
    this.initWeb3().catch((error) => {
      console.log(error)
    })

    this.bigMax = 100000000
    this.state = {
      loading: false,
      walletBalance: null,
      walletBalanceWei: null,
      tokenBalance: null,
      tokenBalanceWei: null,
      unlocked: false,
      account: null,
      network: null,
      balance: 4000000,
      balanceWei: 0,
      totalSupply: 1000000,
      totalSupplyWei: 0,
      ratio: 0.2,
      isBuy: true,
      amount: 0,
      readOnly: false
    };
  }

  componentWillUnmount () {
    clearInterval(this.pollingInterval)
  }

  // events

  accountChange () {
    this.setState({ account: this.relevantCoin.account})
  }
  networkChange () {
    this.setState({ network: this.relevantCoin.network})
  }
  toggleBuy () {
    this.setState({ 
      amount: 0,
      isBuy: !this.state.isBuy
    })
  }
  onChange (event, type) {
    let foo = {}
    foo[type] = event.target.value
    this.setState(foo)
  }
  submit () {
    console.log('submit')
    this.setState({loading: true})
    if (this.state.isBuy) {
      this.relevantCoin.buy(this.state.amount, this.state.account)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash)
        this.setState({loading: true})
      })
      .then((confirm) => {
        console.log('confirm', confirm)
        this.setState({loading: false})
        return confirm
      }).catch((err) => {
        this.setState({loading: false})
        console.error(err)
      })
    } else {
      return this.relevantCoin.decimals().then((decimals) => {
        decimals = Web3.utils.padRight('10', parseInt(decimals, 10));
        return this.relevantCoin.sell(new BigNumber(this.state.amount).times(decimals).toString(), this.state.account)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
          this.setState({loading: true})
        })
        .then((confirm) => {
          console.log('confirm', confirm)
          this.setState({loading: false})
          return confirm
        }).catch((err) => {
          this.setState({loading: false})
          console.error(err)
        })
      })
      
    }
  }


  // methods

  calculateSaleReturn () {
    if (!this.state.totalSupply || !this.state.balance || !this.state.ratio || !this.state.amount) return 'N/A'
    let _supply = new BigNumber(this.state.totalSupply)
    let _connectorBalance = new BigNumber(this.state.balance)
    let _connectorWeight = new Decimal(this.state.ratio)
    let _sellAmount = new BigNumber(this.state.amount)
    if (_supply.eq('0') || _connectorBalance.eq('0') || _connectorWeight.eq('0')) return 'N/A'
    if (_sellAmount.eq('0'))
      return '0';
    if (_sellAmount.eq(_supply))
      return _connectorBalance.toString()
    if (_connectorWeight.eq('1'))
      return _connectorBalance.toString()

    // Return = _connectorBalance * (1 - (1 - _sellAmount / _supply) ^ (1 / (_connectorWeight / 1000000)))
    let one = new BigNumber('1')

    let foo = new Decimal(
      one.minus(
        _sellAmount.div(_supply)
      ).toString()
    )
    BigNumber.config({ DECIMAL_PLACES: 4 });
    return _connectorBalance.times(
      one.minus(
        foo.pow(
          one.div(_connectorWeight).toString()
        ).toString()
      )
    ).toString(10)
  }
  calculatePurchaseReturn() {
    if (!this.state.totalSupply || !this.state.balance || !this.state.ratio || !this.state.amount) return 'N/A'
    let _supply = new BigNumber(this.state.totalSupply)
    let _connectorBalance = new BigNumber(this.state.balance)
    let _connectorWeight = new Decimal(this.state.ratio)
    let _depositAmount = new BigNumber(this.state.amount)
    if (_supply.eq('0') || _connectorBalance.eq('0') || _connectorWeight.eq('0') || _depositAmount.eq('0')) return 'N/A'

    // special case if the weight = 100%
    if (_connectorWeight.eq('1'))
      return _supply.times(_depositAmount).div(_connectorBalance).toString()

    //Return = _supply * ((1 + _depositAmount / _connectorBalance) ^ (_connectorWeight / 1000000) - 1)

    let goo = _depositAmount
      .div(_connectorBalance)
      .plus('1')

    let foo = new Decimal(
      goo.toString()
    ).pow(_connectorWeight)
    BigNumber.config({ DECIMAL_PLACES: 4 });

    return _supply.times( 
      (
        foo
      ).minus('1') 
    ).toString(10)
  }

  // Web3

  initWeb3 () {
    return new Promise((resolve, reject) => {

      let web3Provider = false

      // check for metamask
      if (global.web3) {
        web3Provider = global.web3.currentProvider
        // attempt to try again if no web3Provider
      } else {
        this.setState({ readOnly: true})
        web3Provider = ZeroClientProvider({
          getAccounts: function(){},
          rpcUrl: 'https://rinkeby.infura.io'
        })
      }

      if (web3Provider) {
        global.web3 = new Web3(web3Provider)
        this.startChecking()
      }

    })
  }

  /*
   * Check every second for switching network or switching wallet
   */

  startChecking () {
    if (this.pollingInterval) clearInterval(this.pollingInterval)
    this.pollingInterval = setInterval(this.check.bind(this), 1000)
  }

  stopChecking () {
    if (this.pollingInterval) clearInterval(this.pollingInterval)
  }

  check () {
    this.checkNetwork()
    .then(this.checkAccount.bind(this))
    .then(this.checkEth.bind(this))
    .then(this.checkBalances.bind(this))
    .catch((error) => {
      console.error(error)
      throw new Error(error)
    })
  }

  checkNetwork () {
    return global.web3.eth.net.getId((err, netId) => {
      if (err) console.error(err)
      if (!err && this.state.network !== netId) {
        this.setState({ network: netId})
        return this.relevantCoin.deployContract()
      }
    })
  }


  checkAccount () {
    return global.web3.eth.getAccounts((error, accounts) => {
      if (error) throw new Error(error)
      if (accounts.length && this.state.account !== accounts[0]) {
        this.setState({
          unlocked: true,
          account: accounts[0]
        })
      } else if (!accounts.length) {
        this.setState({
          unlocked: false,
          account: null
        })
      }
    })
  }


  checkBalances () {
    if (!this.props.address) return Promise.resolve()
    return this.checkToken()
    .then(this.checkPool.bind(this))
    .then(this.checkSupply.bind(this))
    .then(this.checkRatio.bind(this))
    .catch((error) => {
      console.log(error)
    })
  }

  checkEth () {
    return global.web3.eth.getBalance(this.state.account, (error, balance) => {
      if (error) throw new Error(error)
      if (this.state.ethBalanceWei !== balance) {
        this.setState({
          walletBalanceWei: balance,
          walletBalance: Web3.utils.fromWei(balance)
        })
      }
    })
  }
  checkToken () {
    return this.relevantCoin.balanceOf(this.state.account).then((balance) => {
      if (this.state.tokenBalance !== balance) {
        return this.relevantCoin.decimals().then((decimals) => {
          decimals = Web3.utils.padRight('10', parseInt(decimals, 10));
          this.setState({
            tokenBalanceWei: balance,
            tokenBalance: new BigNumber(balance).div(decimals).toString()
          })
        })
      }
    })
  }
  checkPool () {
    return this.relevantCoin.poolBalance().then((balance) => {
      if (this.state.balance !== balance) {
        this.setState({
          balanceWei: balance,
          balance: Web3.utils.fromWei(balance)
        })
      }
    })
  }
  checkSupply () {
    return this.relevantCoin.totalSupply().then((totalSupply) => {
      if (this.state.totalSupply !== totalSupply) {
        return this.relevantCoin.decimals().then((decimals) => {
          decimals = Web3.utils.padRight('10', parseInt(decimals, 10));
          this.setState({
            totalSupplyWei: totalSupply,
            totalSupply: new BigNumber(totalSupply).div(decimals).toString()
          })
        })
      }
    })
  }
  checkRatio () {
    return this.relevantCoin.reserveRatio().then((reserveRatio) => {
      reserveRatio = new BigNumber(reserveRatio).div('1000000')
      if (this.state.ratio !== reserveRatio.toString()) {
        this.setState({
          ratio: reserveRatio.toString()
        })
      }
    })
  }



}
export default BondedToken;
