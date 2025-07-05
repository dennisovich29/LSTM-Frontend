import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { TimeSeriesData } from '../types';
import { parseCSVData, parseTextData, validateTimeSeriesData } from '../utils/dataParser';

interface DataInputProps {
  onDataSubmit: (data: TimeSeriesData[], steps: number) => void;
  isLoading: boolean;
}

const DataInput: React.FC<DataInputProps> = ({ onDataSubmit, isLoading }) => {
  const [inputMethod, setInputMethod] = useState<'upload' | 'text'>('upload');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [textData, setTextData] = useState('');
  const [predictionSteps, setPredictionSteps] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<TimeSeriesData[]>([]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const data = parseCSVData(csvText);
          const validation = validateTimeSeriesData(data);
          
          if (validation) {
            setError(validation);
            setParsedData([]);
          } else {
            setParsedData(data);
            setError(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse CSV');
          setParsedData([]);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const handleTextChange = useCallback((value: string) => {
    setTextData(value);
    setError(null);
    
    if (value.trim()) {
      try {
        const data = parseTextData(value);
        const validation = validateTimeSeriesData(data);
        
        if (validation) {
          setError(validation);
          setParsedData([]);
        } else {
          setParsedData(data);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse text data');
        setParsedData([]);
      }
    } else {
      setParsedData([]);
    }
  }, []);

  const handleSubmit = () => {
    if (parsedData.length > 0) {
      onDataSubmit(parsedData, predictionSteps);
    }
  };

  const clearFile = () => {
    setCsvFile(null);
    setParsedData([]);
    setError(null);
  };

  const clearText = () => {
    setTextData('');
    setParsedData([]);
    setError(null);
  };

  const isDataValid = parsedData.length > 0 && !error;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Your Time Series Data</h2>
        
        {/* Input Method Selection */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setInputMethod('upload')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMethod === 'upload'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </button>
          <button
            onClick={() => setInputMethod('text')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMethod === 'text'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Manual Input
          </button>
        </div>

        {/* File Upload */}
        {inputMethod === 'upload' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload CSV file</p>
                <p className="text-sm text-gray-500 mt-1">
                  Expected format: timestamp,value or just values
                </p>
              </label>
            </div>
            
            {csvFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{csvFile.name}</span>
                    {isDataValid && <CheckCircle className="w-4 h-4 text-green-500 ml-2" />}
                  </div>
                  <button
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {isDataValid && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Parsed {parsedData.length} data points successfully
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Text Input */}
        {inputMethod === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Time Series Data
            </label>
            <textarea
              value={textData}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your data in one of these formats:&#10;&#10;1. One value per line:&#10;100&#10;105&#10;102&#10;&#10;2. Timestamp,value pairs:&#10;2023-01-01,100&#10;2023-01-02,105&#10;2023-01-03,102"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            {textData && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  {isDataValid && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                  <span className="text-sm text-gray-600">
                    {isDataValid ? `✓ Parsed ${parsedData.length} data points successfully` : 'Enter data to validate'}
                  </span>
                </div>
                <button
                  onClick={clearText}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prediction Steps */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Future Steps to Predict
          </label>
          <input
            type="number"
            value={predictionSteps}
            onChange={(e) => setPredictionSteps(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isDataValid || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isDataValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Generating Predictions...' : 'Generate Predictions'}
        </button>

        {/* Data Preview */}
        {isDataValid && parsedData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-2 pr-4">Index</th>
                    <th className="pb-2 pr-4">Timestamp</th>
                    <th className="pb-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-1 pr-4">{index + 1}</td>
                      <td className="py-1 pr-4">{item.timestamp}</td>
                      <td className="py-1">{item.value}</td>
                    </tr>
                  ))}
                  {parsedData.length > 10 && (
                    <tr>
                      <td colSpan={3} className="py-2 text-gray-500 text-center">
                        ... and {parsedData.length - 10} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInput;