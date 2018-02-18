import React from 'react';
const Recharts = require('recharts');
const {AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;


class CurveChart extends React.Component {
  render () {
    let { data } = this.props;
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

          <Area dataKey="value"  name={'curve'} key={'curve'} stackId="1" stroke='blue' fill='white'/>
        </AreaChart>
      </div>
    )
  }
}

export default CurveChart;