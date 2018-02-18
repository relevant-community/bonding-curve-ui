import React from 'react';
const Recharts = require('recharts');
const {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ScatterChart,
  ComposedChart
} = Recharts;

console.log(Recharts)

class CurveChart extends React.Component {
  render () {
    if (!this.props.chartData) return;
    if (!this.props.documentReady) return;
    let { data, currentPrice } = this.props.chartData;
    let sellData = data.map(d => d.sell ? { supply: d.supply, value: d.sell } : null).filter(d => d);
    let buyData = data.map(d => d.buy ? { supply: d.supply, value: d.buy } : null).filter(d => d);

    console.log(currentPrice);


    return (
      <div className='chart'>
        <ComposedChart
          width={600}
          height={400}
          data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="supply" type={'number'} />
          <YAxis dataKey="value" type={'number'}/>
          <Tooltip/>

          <ReferenceDot
            isFront={true}
            alwaysShow={true}
            label={'current price'}
            x={currentPrice.supply}
            y={currentPrice.value}
            r={10}
            fill="blue"
          />

          <Area type="monotone" dataKey="sell" stroke="none" fill='pink' />
          <Line dots={false} dataKey="value"  name={'price'} key={'price'} stroke='blue' fill='none'/>


        </ComposedChart>
      </div>
    )
  }
}

export default CurveChart;