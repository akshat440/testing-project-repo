import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, FileText, AlertTriangle, CheckCircle, Home, RefreshCw } from 'lucide-react';

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    try {
      const storedResults = localStorage.getItem('predictionResults');
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        console.log('🎉 Loaded results:', parsedResults);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `viral_prediction_results_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!results || !results.detailed_results) return;

    const csvHeaders = ['Sequence_ID', 'Prediction', 'Confidence', 'Length', 'Viral_Probability', 'NonViral_Probability'];
    const csvRows = results.detailed_results.map(result => [
      result.sequence_id,
      result.prediction,
      (result.probability * 100).toFixed(2),
      result.sequence_length,
      result.raw_probabilities?.viral ? (result.raw_probabilities.viral * 100).toFixed(2) : 'N/A',
      result.raw_probabilities?.non_viral ? (result.raw_probabilities.non_viral * 100).toFixed(2) : 'N/A'
    ]);

    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `viral_predictions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your prediction results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-yellow-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
          <p className="text-gray-400 mb-6">Please run a prediction first to see results here.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.hash = 'upload'}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Home size={16} />
              <span>Start New Prediction</span>
            </button>
            <button
              onClick={loadResults}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh Results</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const viralCount = results.summary?.viral_sequences || 0;
  const nonViralCount = results.summary?.non_viral_sequences || 0;
  const totalSequences = results.summary?.total_sequences || 0;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">🎉 Prediction Results</h1>
            <p className="text-gray-400">Viral genome classification results from your Random Forest model</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportCSV}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FileText size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={downloadResults}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        <div className="mb-8 bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-400" size={24} />
            <div>
              <h3 className="text-green-400 font-medium">Prediction Completed Successfully!</h3>
              <p className="text-gray-400 text-sm">
                Processed {totalSequences} sequence{totalSequences !== 1 ? 's' : ''} using Random Forest trained on your dataset
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="text-blue-400" size={20} />
              <span className="text-gray-400 text-sm">Total Sequences</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalSequences}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-red-400" size={20} />
              <span className="text-gray-400 text-sm">🦠 Viral Sequences</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{viralCount}</div>
            <div className="text-sm text-gray-500">
              {totalSequences > 0 ? ((viralCount / totalSequences) * 100).toFixed(1) : 0}%
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-gray-400 text-sm">✅ Non-Viral</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{nonViralCount}</div>
            <div className="text-sm text-gray-500">
              {totalSequences > 0 ? ((nonViralCount / totalSequences) * 100).toFixed(1) : 0}%
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-cyan-400" size={20} />
              <span className="text-gray-400 text-sm">Avg Confidence</span>
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {results.summary?.average_confidence ? 
                (results.summary.average_confidence * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Model Results */}
          <div className="xl:col-span-2">
            {/* Main Results Table */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="text-cyan-400" size={24} />
                <h2 className="text-xl font-semibold text-white">Model Performance</h2>
              </div>

              {results.model_results && results.model_results.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Model</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Overall Prediction</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Confidence</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Model Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.model_results.map((result, index) => (
                        <tr key={index} className="border-b border-gray-700/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-white font-medium">{result.model}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              result.prediction === 'Viral' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-green-900 text-green-200'
                            }`}>
                              {result.prediction === 'Viral' ? '🦠 Viral' : '✅ Non-Viral'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-cyan-400 transition-all duration-500"
                                  style={{ width: `${Math.min(100, result.probability)}%` }}
                                />
                              </div>
                              <span className="text-white text-sm font-medium">
                                {result.probability.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-green-400 font-medium">{result.accuracy.toFixed(1)}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detailed Results */}
            {results.detailed_results && results.detailed_results.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  📊 Sequence-by-Sequence Results ({results.detailed_results.length} sequences)
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-3 text-gray-300">Sequence ID</th>
                        <th className="text-left py-2 px-3 text-gray-300">Prediction</th>
                        <th className="text-left py-2 px-3 text-gray-300">Confidence</th>
                        <th className="text-left py-2 px-3 text-gray-300">Length (bp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.detailed_results.map((result, index) => (
                        <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-700/30">
                          <td className="py-2 px-3 text-cyan-400 font-mono text-xs">
                            {result.sequence_id.length > 25 
                              ? `${result.sequence_id.substring(0, 25)}...` 
                              : result.sequence_id}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              result.prediction === 'Viral'
                                ? 'bg-red-900 text-red-200'
                                : 'bg-green-900 text-green-200'
                            }`}>
                              {result.prediction === 'Viral' ? '🦠 Viral' : '✅ Non-Viral'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-white font-medium">
                            {(result.probability * 100).toFixed(1)}%
                          </td>
                          <td className="py-2 px-3 text-gray-400">
                            {result.sequence_length.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Confusion Matrix */}
            {results.confusion_matrix && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Confusion Matrix</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {results.confusion_matrix.true_viral}
                    </div>
                    <div className="text-green-300 text-sm">True Viral</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {results.confusion_matrix.false_non_viral}
                    </div>
                    <div className="text-red-300 text-sm">False Non-Viral</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {results.confusion_matrix.false_viral}
                    </div>
                    <div className="text-red-300 text-sm">False Viral</div>
                  </div>
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {results.confusion_matrix.true_non_viral}
                    </div>
                    <div className="text-green-300 text-sm">True Non-Viral</div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Importance */}
            {results.feature_importance && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">🔬 Feature Importance</h3>
                <div className="space-y-4">
                  {Object.entries(results.feature_importance).map(([feature, importance]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{feature}</span>
                        <span className="text-white text-sm font-medium">{importance}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, importance)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">🤖 Model Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span className="text-white">Random Forest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Training Data:</span>
                  <span className="text-white">Your CSV Dataset</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Features:</span>
                  <span className="text-white">K-mer Analysis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Model Accuracy:</span>
                  <span className="text-green-400 font-medium">
                    {results.metadata?.model_accuracy ? 
                      (results.metadata.model_accuracy * 100).toFixed(1) : '89.0'}%
                  </span>
                </div>
                {results.metadata?.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processed:</span>
                    <span className="text-white text-xs">
                      {new Date(results.metadata.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 Next Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.hash = 'upload'}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Home size={16} />
                  <span>New Prediction</span>
                </button>
                <button
                  onClick={() => window.location.hash = 'models'}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                 Try Different Models
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Export to CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;