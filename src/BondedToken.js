import React from 'react';
import RelevantCoin from './relevant-contracts/dapp-module/RelevantCoin/index.js'
import './BondedToken.css';
import BondedTokenHeader  from './BondedTokenHeader';
import BondedTokenTransact  from './BondedTokenTransact.js';
import BondedTokenAdvanced  from './BondedTokenAdvanced.js';
import {Decimal} from 'decimal.js';
import CurveChart from './Chart';
var BigNumber = require('bignumber.js');
const Web3 = require('web3')
const utils = require('web3-utils')
const ZeroClientProvider = require('web3-provider-engine/zero.js')

class BondedToken extends React.Component {
  render() {

    return (


      <div className="--bondedToken">
        {this.state.loading && (
          <div>{this.state.loading}</div>
        )}


        {this.state.account && <BondedTokenHeader 
          account={this.state.account} 
          walletBalance={this.state.walletBalance}
          tokenBalance={this.state.tokenBalance}
          />}

        <BondedTokenTransact
          submit={this.submit}
          calculateSaleReturn={this.calculateSaleReturn}
          calculatePurchaseReturn={this.calculatePurchaseReturn}
          onChange={this.onChange}
          amount={this.state.amount}
          bigMax={this.bigMax}
          totalSupply={this.state.totalSupply}
          tokenBalance={this.state.tokenBalance}
          walletBalance={this.state.walletBalance}
          address={this.state.address}
          toggleBuy={this.toggleBuy}
          isBuy={this.state.isBuy} />

        <BondedTokenAdvanced
          chartData={this.chartData}
          bigMax={this.bigMax}
          onChange={this.onChange}
          balance={this.state.balance}
          ratio={this.state.ratio}
          totalSupply={this.state.totalSupply}
          address={this.state.address}
          advanced={this.state.advanced}
          toggleAdvanced={this.toggleAdvanced} />

  {/*      <pre style={{'textAlign':'left'}}>
        {JSON.stringify(this.state).split(',').join(',\n')}
        </pre>*/}
      </div>
    );
  }

  constructor(props) {
    super(props);
    if (props.address) {
      this.relevantCoin = new RelevantCoin({ address: props.address })
    }
    this.initWeb3().catch((error) => {
      console.log(error)
    })
    this.toggleAdvanced = this.toggleAdvanced.bind(this)
    this.toggleBuy = this.toggleBuy.bind(this)
    this.submit = this.submit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.calculateSaleReturn = this.calculateSaleReturn.bind(this)
    this.calculatePurchaseReturn = this.calculatePurchaseReturn.bind(this)

    this.bigMax = 1000000
    this.state = {
      address: this.props.address,
      advanced: false,
      loading: false,
      walletBalance: 0,
      walletBalanceWei: 0,
      tokenBalance: 0,
      tokenBalanceWei: 0,
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
      readOnly: false,
    };
    this.getChartData = this.getChartData.bind(this);
    this.documentReady = false;
    this.chartData = {}
  }

  componentDidMount() {
    this.documentReady = true;
    this.getChartData(this.state);
  }

  componentWillUnmount () {
    clearInterval(this.pollingInterval)
  }

  componentWillUpdate(newProps, newState) {
    this.getChartData(newState);
  }
  // events

  toggleBuy () {
    if (this.state.loading) return
    this.setState({
      amount: 0,
      isBuy: !this.state.isBuy
    })
  }
  toggleAdvanced () {
    this.setState({ 
      advanced: !this.state.advanced
    })
  }
  onChange (event, type) {
    if (this.state.loading) return
    let foo = {}
    foo[type] = event.target.value
    foo[type + 'Wei'] = '0'
    this.setState(foo)
  }
  submit () {
    if (this.state.amount <= 0 || this.state.loading) return
    console.log('submit')
    this.setState({loading: 'Please Review & Sign Transaction'})
    if (this.state.isBuy) {
      this.relevantCoin.buy(this.state.amount, this.state.account)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash)
        this.setState({loading: 'Transaction is waiting for confirmation'})
      })
      .then((confirm) => {
        console.log('confirm', confirm)
        this.setState({
          amount: 0,
          loading: 'Transaction confirmed'
        })
        this.check()
        setTimeout(() => {
          this.setState({loading: false})
        }, 1000)
        return confirm
      }).catch((err) => {
        this.setState({loading: false})
        console.error(err)
      })
    } else {
      return this.relevantCoin.decimals().then((decimals) => {
        decimals = utils.padRight('10', parseInt(decimals, 10));
        return this.relevantCoin.sell(new BigNumber(this.state.amount).times(decimals).toString(), this.state.account)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
          this.setState({loading: 'Transaction is waiting for confirmation'})
        })
        .then((confirm) => {
          console.log('confirm', confirm)
          this.setState({
            amount: 0,
            loading: 'Transaction confirmed'
          })
          this.check()
          setTimeout(() => {
            this.setState({loading: false})
          }, 1000)
          return confirm
        }).catch((err) => {
          this.setState({loading: false})
          console.error(err)
        })
      })

    }
  }

  getChartData (props) {
    // if (this.data) return this.data;
    let data = [];
    let { totalSupply, ratio, balance } = props;
    let step = Math.round(totalSupply / 100);
    let price = balance / ( ratio * totalSupply );
    let currentPrice = { supply: totalSupply, value: price };

    for(let i = step; i< totalSupply * 1.5; i += step) {
      if( i < totalSupply) {
        let eth = 1 * this.calculateSaleReturn({ ...props, amount: totalSupply - i });
        let price = (parseFloat(balance, 10) - eth) / ( ratio * i );
        data.push({ supply: i, sell: price, value: price});
      } else if (i > totalSupply) {
        let eth = 1 * this.calculateBuyPrice({ ...props, amount: i - totalSupply });
        let price = (eth + parseFloat(balance, 10)) / ( ratio * i );
        data.push({ supply: 1 * i, buy: price, value: 1 * price });
      }
    }
    this.chartData = { data, currentPrice };
    return data;
  }

  // methods

  calculateSaleReturn (props) {
    let { totalSupply, balance, ratio, amount } = props || this.state;
    if (!totalSupply || !balance || !ratio || !amount) return 'N/A'
    let _supply = new BigNumber(totalSupply)
    let _connectorBalance = new BigNumber(balance)
    let _connectorWeight = new Decimal(ratio)
    let _sellAmount = new BigNumber(amount)
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
    );
    BigNumber.config({ DECIMAL_PLACES: 4 });
    return _connectorBalance.times(
      one.minus(
        foo.pow(
          one.div(_connectorWeight).toString()
        ).toString()
      )
    ).toString(10)
  }

  calculateBuyPrice(props) {
    let { totalSupply, balance, ratio, amount } = props || this.state;
    if (!totalSupply || !balance || !ratio || !amount) return 'N/A'
    let _supply = new BigNumber(totalSupply)
    let _connectorBalance = new BigNumber(balance)
    let _connectorWeight = new Decimal(ratio)
    let _buyAmount = new BigNumber(amount)
    if (_supply.eq('0') || _connectorBalance.eq('0') || _connectorWeight.eq('0')) return 'N/A'
    if (_buyAmount.eq('0'))
      return '0';

    // Return = _connectorBalance * (1 - (1 - _sellAmount / _supply) ^ (1 / (_connectorWeight / 1000000)))
    let one = new BigNumber('1');

    let foo = new Decimal(
      one.plus(
        _buyAmount.div(_supply)
      ).toString()
    );
    BigNumber.config({ DECIMAL_PLACES: 4 });
    return _connectorBalance.times(
        foo.pow(
          one.div(_connectorWeight).toString()
        )
        .minus(one.toString())
    ).toString(10)
  }

  calculatePurchaseReturn(props) {
    let { totalSupply, balance, ratio, amount } = props || this.state;
    if (!totalSupply || !balance || !ratio || !amount) return 'N/A'
    let _supply = new BigNumber(totalSupply)
    let _connectorBalance = new BigNumber(balance)
    let _connectorWeight = new Decimal(ratio)
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
      if (!err && this.state.network !== netId && this.relevantCoin) {
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
    if (!this.state.address) return Promise.resolve()
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
      if (this.state.walletBalanceWei !== balance) {
        BigNumber.config({ DECIMAL_PLACES: 4 });
        this.setState({
          walletBalanceWei: balance,
          walletBalance: new BigNumber(utils.fromWei(balance)).toString(10)
        })
      }
    })
  }
  checkToken () {
    return this.relevantCoin.balanceOf(this.state.account).then((balance) => {
      if (this.state.tokenBalanceWei !== balance) {
        return this.relevantCoin.decimals().then((decimals) => {
          decimals = utils.padRight('10', parseInt(decimals, 10));
          BigNumber.config({ DECIMAL_PLACES: 4 });
          this.setState({
            tokenBalanceWei: balance,
            tokenBalance: new BigNumber(balance).div(decimals).toString(10)
          })
        })
      }
    })
  }
  checkPool () {
    return this.relevantCoin.poolBalance().then((balance) => {
      if (this.state.balanceWei !== balance) {
        BigNumber.config({ DECIMAL_PLACES: 4 });
        this.setState({
          balanceWei: balance,
          balance: new BigNumber(utils.fromWei(balance)).toString(10)
        })
      }
    })
  }
  checkSupply () {
    return this.relevantCoin.totalSupply().then((totalSupply) => {
      if (this.state.totalSupplyWei !== totalSupply) {
        return this.relevantCoin.decimals().then((decimals) => {
          decimals = utils.padRight('10', parseInt(decimals, 10));
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
