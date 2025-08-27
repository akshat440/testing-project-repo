import React from 'react';
import { Upload, Home, BarChart3, Info, Zap } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Viral Genome Prediction System</h1>
              <p className="text-gray-400 text-sm">Advanced AI-powered genomic analysis</p>
            </div>
          </div>
          <div className="w-10 h-6 bg-white rounded-md"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'home' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentPage('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'upload' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setCurrentPage('models')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'models' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Models</span>
            </button>
            <button
              onClick={() => setCurrentPage('results')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'results' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Results</span>
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'about' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;