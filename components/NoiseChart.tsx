
import React from 'react';
import type { NoiseRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface NoiseChartProps {
  data: NoiseRecord[];
  sensitivity: number;
}

const NoiseChart: React.FC<NoiseChartProps> = ({ data, sensitivity }) => {
  // Always display the last 30 seconds of data
  const chartData = data.slice(-30);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <XAxis tick={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#5C4033', fontFamily: 'Gowun Dodum' }} />
        <Bar dataKey="level" barSize={20}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.level > sensitivity ? '#FFA500' : '#8FBC8F'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NoiseChart;
