import React from 'react';
const Recharts = require('recharts');
const {AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot, ScatterChart} = Recharts;

console.log(Recharts)

class CurveChart extends React.Component {
  render () {
    if (!this.props.chartData) return;
    if (!this.props.documentReady) return;
    let { data, currentPrice } = this.props.chartData;
    let sellData = data.map(d => d.sell ? { supply: d.supply, value: d.sell } : null).filter(d => d);
    let buyData = data.map(d => d.buy ? { supply: d.supply, value: d.buy } : null).filter(d => d);
    return (
      <div className='chart'>
        <AreaChart
          width={600}
          height={400}
          data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="supply" />
          <YAxis/>
          <Tooltip/>
          <ReferenceDot alwaysShow={true} x={0} y={0} r={20} fill="red" stroke="red" />

          <Area dataKey="value"  name={'price'} key={'price'} stroke='blue' fill='none'/>
        </AreaChart>
      </div>
    )
  }
}

export default CurveChart;