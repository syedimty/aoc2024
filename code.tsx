import React, { useState } from 'react';
import { Upload, FileText, Brain, Zap, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentClassifier = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleClassify = () => {
    if (!uploadedFile || !selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setResults({
        category: selectedMethod === 'ML' ? 'Financial Report' : 'Legal Contract',
        confidence: selectedMethod === 'ML' ? 87.3 : 92.1,
        dateRange: '2024-01-15 to 2024-12-31',
        method: selectedMethod
      });
      setIsProcessing(false);
    }, 3000);
  };

  const resetForm = () => {
    setUploadedFile(null);
    setSelectedMethod('');
    setResults(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Classifier</h1>
          <p className="text-lg text-gray-600">Upload documents and classify them using ML or LLM technology</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!results ? (
            <div className="space-y-8">
              {/* Upload Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Upload className="mr-2" size={24} />
                  Upload Document
                </h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : uploadedFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <CheckCircle className="mx-auto text-green-500" size={48} />
                      <div>
                        <p className="text-lg font-medium text-green-700">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={resetForm}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Upload different file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="mx-auto text-gray-400" size={48} />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Drop your document here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports PDF, DOC, DOCX, TXT files
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Method Selection */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Choose Classification Method
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      selectedMethod === 'ML' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMethod('ML')}
                  >
                    <div className="flex items-center mb-3">
                      <Brain className="text-blue-600 mr-3" size={32} />
                      <h3 className="text-xl font-semibold text-gray-800">Machine Learning</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Fast and efficient classification using traditional ML algorithms. 
                      Best for structured documents with clear patterns.
                    </p>
                  </div>
                  
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      selectedMethod === 'LLM' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMethod('LLM')}
                  >
                    <div className="flex items-center mb-3">
                      <Zap className="text-purple-600 mr-3" size={32} />
                      <h3 className="text-xl font-semibold text-gray-800">Large Language Model</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Advanced understanding of context and nuance. 
                      Superior for complex documents with varied formats.
                    </p>
                  </div>
                </div>
              </div>

              {/* Classify Button */}
              <div className="text-center">
                <button
                  onClick={handleClassify}
                  disabled={!uploadedFile || !selectedMethod || isProcessing}
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    !uploadedFile || !selectedMethod || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Document...
                    </div>
                  ) : (
                    'Classify Document'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Classification Complete</h2>
                <p className="text-gray-600">Your document has been successfully analyzed</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                {/* Variation 1: Compact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Document Category</h3>
                    <p className="text-lg font-bold text-blue-600">{results.category}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Confidence</h3>
                    <p className="text-lg font-bold text-green-600">{results.confidence}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${results.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Date Range</h3>
                    <p className="text-sm font-bold text-purple-600">{results.dateRange}</p>
                  </div>
                </div>

                {/* Variation 2: Inline Style */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{results.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Confidence:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">{results.confidence}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Date Range:</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{results.dateRange}</span>
                    </div>
                  </div>
                </div>

                {/* Variation 3: Minimal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category</h3>
                    <p className="text-base font-semibold text-gray-800">{results.category}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Confidence</h3>
                    <p className="text-base font-semibold text-gray-800">{results.confidence}%</p>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date Range</h3>
                    <p className="text-xs font-semibold text-gray-800">{results.dateRange}</p>
                  </div>
                </div>

                {/* Variation 4: List Style */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Document Category</span>
                      <span className="text-sm font-semibold text-blue-600">{results.category}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Confidence Level</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-green-600">{results.confidence}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${results.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-600">Date Range</span>
                      <span className="text-sm font-semibold text-purple-600">{results.dateRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-600" size={24} />
                  Analysis Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Method Used:</span>
                      <span className="text-gray-900 font-semibold">{results.method === 'ML' ? 'Machine Learning' : 'Large Language Model'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">File Name:</span>
                      <span className="text-gray-900 font-semibold truncate ml-2">{uploadedFile.name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">File Size:</span>
                      <span className="text-gray-900 font-semibold">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Processing Time:</span>
                      <span className="text-gray-900 font-semibold">3.2 seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-x-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Classify Another Document
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentClassifier;
