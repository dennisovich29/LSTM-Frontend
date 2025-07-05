import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HomePage from './components/HomePage';
import DataInput from './components/DataInput';
import Chart from './components/Chart';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { TimeSeriesData, PredictionResponse } from './types';
import { predictTimeSeries } from './services/api';

type AppState = 'home' | 'input' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handleGetStarted = () => {
    setCurrentState('input');
    setError(null);
  };

  const handleDataSubmit = async (data: TimeSeriesData[], steps: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await predictTimeSeries({ data, steps });
      setPredictionResult(result);
      setCurrentState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setError(null);
    setPredictionResult(null);
  };

  const handleBackToInput = () => {
    setCurrentState('input');
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    if (currentState === 'results') {
      setCurrentState('input');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {currentState !== 'home' && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={currentState === 'input' ? handleBackToHome : handleBackToInput}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {currentState === 'input' ? 'Back to Home' : 'Back to Input'}
                </button>
                <h1 className="text-xl font-bold text-gray-900">LSTM Forecaster</h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentState === 'input' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${currentState === 'results' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentState === 'home' && (
          <HomePage onGetStarted={handleGetStarted} />
        )}

        {currentState === 'input' && (
          <div>
            <DataInput onDataSubmit={handleDataSubmit} isLoading={isLoading} />
            {isLoading && (
              <div className="mt-8 flex justify-center">
                <Loader message="Processing your data and generating predictions..." />
              </div>
            )}
            {error && (
              <div className="mt-8 max-w-4xl mx-auto">
                <ErrorMessage message={error} onRetry={handleRetry} />
              </div>
            )}
          </div>
        )}

        {currentState === 'results' && predictionResult && (
          <div className="max-w-6xl mx-auto">
            <Chart
              originalData={predictionResult.original}
              predictedData={predictionResult.predicted}
            />
            {predictionResult.message && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{predictionResult.message}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;