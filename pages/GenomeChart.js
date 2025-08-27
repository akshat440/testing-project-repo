import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const GenomeChart = ({ data = [] }) => {
  // Sample data for visualization
  const sampleData = [
    { name: 'Viral Sequences', value: 142, color: 'bg-red-500' },
    { name: 'Non-Viral Sequences', value: 158, color: 'bg-green-500' },
    { name: 'Uncertain', value: 12, color: 'bg-yellow-500' }
  ];

  const chartData = data.length > 0 ? data : sampleData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400">Sequence Classification</h3>
        </div>
        
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm text-gray-300">{item.name}</div>
              <div className="flex-1 bg-slate-700 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${(item.value / 300) * 100}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-white font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-purple-400">Model Metrics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">94.2%</div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">91.8%</div>
            <div className="text-gray-400 text-sm">Precision</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">89.5%</div>
            <div className="text-gray-400 text-sm">Recall</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">90.6%</div>
            <div className="text-gray-400 text-sm">F1-Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenomeChart;