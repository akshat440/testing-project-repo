import React from 'react';
import { Info } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-semibold text-cyan-400">About This System</h2>
        </div>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          The Viral Genome Prediction System uses advanced machine learning algorithms to classify DNA sequences as viral or non-viral with high accuracy. Our models are trained on comprehensive genomic datasets and validated against established benchmarks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Supported Formats</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• FASTA (.fasta, .fa)</li>
              <li>• FASTQ (.fastq, .fq)</li>
              <li>• Raw DNA sequences</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Model Performance</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Accuracy: 92-95%</li>
              <li>• Sensitivity: 89-94%</li>
              <li>• Specificity: 91-96%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;