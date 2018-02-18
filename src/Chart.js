import React from 'react';
const Recharts = require('recharts');
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot} = Recharts;


class CurveChart extends React.Component {
  render () {
    if (!this.props.chartData) return null
    let { data, currentPrice } = this.props.chartData;
    if (!data || !currentPrice) return null
    // let sellData = data.map(d => d.sell && d.supply ? { supply: d.supply, value: d.sell } : null).filter(d => d);
    // let buyData = data.map(d => d.buy && d.supply ? { supply: d.supply, value: d.buy } : null).filter(d => d);
    return (
      <div className='chart'>
        <LineChart
          width={600}
          height={400}
          data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="supply" />
          <YAxis/>
          <Tooltip/>
          <ReferenceDot alwaysShow x={'0'} y={'0'} label="Current price" r={20} fill="red" stroke="none" />

          <Line dots={false} dataKey="value"  name={'curve'} key={'curve'} stackId="1" stroke='blue' fill='none'/>
        </LineChart>
      </div>
    )
  }
}

export default CurveChart;