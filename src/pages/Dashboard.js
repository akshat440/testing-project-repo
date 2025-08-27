import React, { useState } from 'react';
import { Upload, BarChart3, Zap, Play, Check } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';

const Dashboard = ({ currentView }) => {
  const [selectedModels, setSelectedModels] = useState(['knn', 'random-forest', 'deep-vir-finder']);
  const [dnaSequence, setDnaSequence] = useState('');
  const [showResults, setShowResults] = useState(false);

  const modelOptions = [
    {
      id: 'knn',
      name: 'K-Nearest Neighbors',
      description: 'Distance-based classification',
      selected: true
    },
    {
      id: 'random-forest',
      name: 'Random Forest',
      description: 'Ensemble tree-based method',
      selected: true
    },
    {
      id: 'xgboost',
      name: 'XGBoost',
      description: 'Gradient boosting framework',
      selected: false
    },
    {
      id: 'catboost',
      name: 'CatBoost',
      description: 'Categorical boosting',
      selected: false
    },
    {
      id: 'lightgbm',
      name: 'LightGBM',
      description: 'gbm FRAMEWORK',
      selected: false
    },
    {
      id: 'adaboost',
      name: 'AdaBoost',
      description: 'Adaptive boosting algorithm',
      selected: false
    },
    {
      id: 'deep-vir-finder',
      name: 'DeepVirFinder',
      description: 'Deep learning approach',
      selected: true
    }
  ];

  const toggleModel = (modelId) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const runPrediction = () => {
    setShowResults(true);
  };

  if (currentView === 'home') {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Welcome to Viral Genome Analysis</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Upload your DNA sequences and leverage state-of-the-art machine learning models to predict viral content with high accuracy.
          </p>
        </div>
        <DashboardCards />
      </div>
    );
  }

  if (currentView === 'upload') {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-400">File Upload</h3>
            </div>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center mb-6">
              <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Drop FASTA/FASTQ files here or click to browse</p>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors">
                Select Files
              </button>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
              <Upload className="w-5 h-5" />
              <span>Batch Upload</span>
            </button>
          </div>

          {/* Raw DNA Sequence */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-green-400">Raw DNA Sequence</h3>
            </div>
            
            <textarea
              value={dnaSequence}
              onChange={(e) => setDnaSequence(e.target.value)}
              placeholder="Paste your DNA sequence here (ATCG format)..."
              className="w-full h-48 bg-slate-700 border border-slate-600 rounded-lg p-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono text-sm"
            />
            
            <div className="flex justify-between items-center mt-4 mb-6">
              <span className="text-gray-400 text-sm">Length: {dnaSequence.length} bp</span>
              <span className="text-gray-400 text-sm">Format: Raw DNA</span>
            </div>

            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Process Sequence
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'models') {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-semibold text-cyan-400">Model Selection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {modelOptions.map((model) => (
              <div
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedModels.includes(model.id)
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedModels.includes(model.id)
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedModels.includes(model.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{model.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={runPrediction}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Run Prediction</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'results') {
    if (!showResults) {
      return (
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-16 text-center">
            <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Results Yet</h3>
            <p className="text-gray-500">Upload sequences and run predictions to see results here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Results Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-cyan-400">Prediction Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-gray-300 font-medium">Model</th>
                  <th className="text-left py-3 text-gray-300 font-medium">Prediction</th>
                  <th className="text-left py-3 text-gray-300 font-medium">Probability</th>
                  <th className="text-left py-3 text-gray-300 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 text-white">K-Nearest Neighbors</td>
                  <td className="py-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                      Viral
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{width: '87%'}}></div>
                      </div>
                      <span className="text-white font-medium">87.0%</span>
                    </div>
                  </td>
                  <td className="py-4 text-white">92.0%</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 text-white">Random Forest</td>
                  <td className="py-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                      Viral
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      <span className="text-white font-medium">94.0%</span>
                    </div>
                  </td>
                  <td className="py-4 text-white">89.0%</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-4 text-white">DeepVirFinder</td>
                  <td className="py-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                      Viral
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{width: '96%'}}></div>
                      </div>
                      <span className="text-white font-medium">96.0%</span>
                    </div>
                  </td>
                  <td className="py-4 text-white">95.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Confusion Matrix */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <h3 className="text-lg font-semibold text-green-400">Confusion Matrix</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">142</div>
                <div className="text-green-200 text-sm">True Viral</div>
              </div>
              <div className="bg-red-600 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">8</div>
                <div className="text-red-200 text-sm">False Non-Viral</div>
              </div>
              <div className="bg-red-700 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">12</div>
                <div className="text-red-200 text-sm">False Viral</div>
              </div>
              <div className="bg-green-700 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">138</div>
                <div className="text-green-200 text-sm">True Non-Viral</div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">Feature Importance</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'GC Content', value: 85 },
                { name: 'Codon Usage', value: 72 },
                { name: 'K-mer Frequency', value: 68 },
                { name: 'ORF Length', value: 45 },
                { name: 'Repeat Regions', value: 32 }
              ].map((feature) => (
                <div key={feature.name} className="flex items-center justify-between">
                  <span className="text-gray-300">{feature.name}</span>
                  <div className="flex items-center space-x-3 flex-1 max-w-xs">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                        style={{width: `${feature.value}%`}}
                      ></div>
                    </div>
                    <span className="text-purple-400 font-medium text-sm w-10">{feature.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="max-w-7xl mx-auto p-8">Dashboard View: {currentView}</div>;
};

export default Dashboard;