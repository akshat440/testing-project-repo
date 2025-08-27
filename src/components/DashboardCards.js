import React from 'react';
import { Upload, Zap, BarChart3 } from 'lucide-react';

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400">Upload Data</h3>
        </div>
        <p className="text-gray-300">
          Upload FASTA/FASTQ files or paste raw DNA sequences for analysis.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400">AI Models</h3>
        </div>
        <p className="text-gray-300">
          Choose from multiple ML models including XGBoost, Random Forest, and DeepVirFinder.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-400">Visualizations</h3>
        </div>
        <p className="text-gray-300">
          Interactive charts and heatmaps to analyze prediction results and model performance.
        </p>
      </div>
    </div>
  );
};

export default DashboardCards;