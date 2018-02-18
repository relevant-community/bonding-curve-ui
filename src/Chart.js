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
          <YAxis dataKey="value" type={'number'} />
          <Tooltip/>

          <Area isAnimationActive={false} dots={false} stackOffset={'none'} dataKey="value" name={'price'} key={'price'} stroke='blue' fill='none'/>

          <Area isAnimationActive={false} stackOffset={'none'} dataKey="sell" stroke="blue" fill='blue' />

          <ReferenceDot
            isFront={true}
            alwaysShow={true}
            // label={'current price'}
            x={currentPrice.supply}
            y={currentPrice.value}
            r={8}
            fill="blue"
            stroke="none"
          />


        </ComposedChart>
      </div>
    )
  }
}

export default CurveChart;