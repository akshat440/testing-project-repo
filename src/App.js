import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Dashboard currentView="home" />;
      case 'upload':
        return <Dashboard currentView="upload" />;
      case 'models':
        return <Dashboard currentView="models" />;
      case 'results':
        return <Dashboard currentView="results" />;
      case 'about':
        return <About />;
      default:
        return <Dashboard currentView="home" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="min-h-screen">
        {renderPage()}
      </main>
      <footer className="bg-slate-900 border-t border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Powered by advanced machine learning • Built with React & Tailwind CSS
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">NCBI Database</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">VirFinder Reference</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

