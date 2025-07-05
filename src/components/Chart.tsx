import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesData } from '../types';

interface ChartProps {
  originalData: TimeSeriesData[];
  predictedData: TimeSeriesData[];
}

const Chart: React.FC<ChartProps> = ({ originalData, predictedData }) => {
  // Combine original and predicted data for visualization
  const combinedData = React.useMemo(() => {
    const data: any[] = [];
    
    // Add original data
    originalData.forEach((item, index) => {
      data.push({
        index: index,
        timestamp: item.timestamp,
        original: item.value,
        predicted: null,
      });
    });
    
    // Add predicted data
    predictedData.forEach((item, index) => {
      data.push({
        index: originalData.length + index,
        timestamp: item.timestamp,
        original: null,
        predicted: item.value,
      });
    });
    
    return data;
  }, [originalData, predictedData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Index: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value !== null ? entry.value.toFixed(4) : 'N/A'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction Results</h2>
        <p className="text-gray-600">
          Blue line shows original data, red line shows predicted values
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="index"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="original"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              connectNulls={false}
              name="Original Data"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              connectNulls={false}
              name="Predicted Data"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-1">Original Points</h4>
          <p className="text-2xl font-bold text-blue-600">{originalData.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-1">Predicted Points</h4>
          <p className="text-2xl font-bold text-red-600">{predictedData.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">Avg Original</h4>
          <p className="text-2xl font-bold text-green-600">
            {originalData.length > 0 
              ? (originalData.reduce((sum, item) => sum + item.value, 0) / originalData.length).toFixed(2)
              : '0'
            }
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-1">Avg Predicted</h4>
          <p className="text-2xl font-bold text-purple-600">
            {predictedData.length > 0 
              ? (predictedData.reduce((sum, item) => sum + item.value, 0) / predictedData.length).toFixed(2)
              : '0'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chart;