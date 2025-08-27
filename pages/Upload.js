import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [rawSequence, setRawSequence] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const API_URL = 'http://localhost:5000';

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Validate DNA sequence
  const validateDNASequence = (sequence) => {
    const validChars = /^[ATGCN\s\n\r]+$/i;
    return validChars.test(sequence);
  };

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Check file type
      if (!file.name.toLowerCase().match(/\.(fasta|fas|fa|fna|txt)$/)) {
        showNotification('Please select a FASTA file (.fasta, .fas, .fa, .fna)', 'error');
        return;
      }
      
      setUploadedFile(file);
      setRawSequence(''); // Clear raw sequence when file is uploaded
      showNotification(`File selected: ${file.name}`, 'success');
    }
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Process raw DNA sequence
  const processRawSequence = () => {
    const sequence = rawSequence.trim();
    
    if (!sequence) {
      showNotification('Please enter a DNA sequence', 'error');
      return;
    }
    
    if (!validateDNASequence(sequence)) {
      showNotification('Invalid DNA sequence. Only A, T, G, C, N characters allowed.', 'error');
      return;
    }
    
    // Create FASTA file from sequence
    const cleanSequence = sequence.replace(/[\s\n\r]/g, '').toUpperCase();
    const fastaContent = `>User_Sequence\n${cleanSequence}`;
    const blob = new Blob([fastaContent], { type: 'text/plain' });
    const file = new File([blob], 'user_sequence.fasta', { type: 'text/plain' });
    
    setUploadedFile(file);
    showNotification('Sequence processed! Ready for prediction.', 'success');
  };

  // Navigate to models page
  const proceedToModels = () => {
    if (!uploadedFile) {
      showNotification('Please select a file or enter a sequence first', 'error');
      return;
    }
    
    // Store file data for models page
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('uploadedFile', JSON.stringify({
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type
      }));
      localStorage.setItem('fileContent', e.target.result);
      
      // Navigate to models page (adjust based on your routing)
      window.location.hash = 'models';
    };
    reader.readAsText(uploadedFile);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Upload Genome Data</h1>
          <p className="text-gray-400">Upload FASTA files or enter raw DNA sequences for viral genome prediction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="text-cyan-400" size={24} />
              <h2 className="text-xl font-semibold text-white">File Upload</h2>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-300 mb-2">Drop FASTA/FASTQ files here or click to browse</p>
              <p className="text-gray-500 text-sm">Supported formats: .fasta, .fas, .fa, .fna</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".fasta,.fas,.fa,.fna,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* File Info */}
            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                  <CheckCircle className="text-green-400" size={24} />
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={proceedToModels}
              disabled={!uploadedFile}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Upload size={20} />
              <span>Proceed to Model Selection</span>
            </button>
          </div>

          {/* Raw DNA Sequence Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">DNA</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Raw DNA Sequence</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Paste your DNA sequence here (ATCG format)...
                </label>
                <textarea
                  value={rawSequence}
                  onChange={(e) => setRawSequence(e.target.value)}
                  placeholder="ATCGATCGATCGTAGCTACGATCGTAGCTACGATCG..."
                  className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 font-mono text-sm resize-none focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Length: {rawSequence.replace(/[\s\n\r]/g, '').length} bp
                </span>
                <span className="text-gray-400">Format: Raw DNA</span>
              </div>

              <button
                onClick={processRawSequence}
                disabled={!rawSequence.trim()}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
              >
                Process Sequence
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test Section */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">🧪 Quick Test</h3>
          <p className="text-gray-400 mb-4">Try with these sample sequences:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setRawSequence('ATCGATCGATCGTAGCTACGATCGTAGCTACGATCGTAGCTACGATCGATCGATCGTAGCTACGATCGTAGCTACGATCG')}
              className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-left hover:bg-red-900/50 transition-colors"
            >
              <div className="text-red-400 font-medium">🦠 Viral-like Sequence</div>
              <div className="text-gray-400 text-sm mt-1">High GC content pattern</div>
            </button>
            
            <button
              onClick={() => setRawSequence('AAAAAATTTTTTGGGGGGCCCCCCAAAAAATTTTTTGGGGGGCCCCCCAAAAAATTTTTTGGGGGGCCCCCC')}
              className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-left hover:bg-green-900/50 transition-colors"
            >
              <div className="text-green-400 font-medium">✅ Non-Viral-like Sequence</div>
              <div className="text-gray-400 text-sm mt-1">Repetitive AT-rich pattern</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;