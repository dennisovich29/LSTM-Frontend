import { PredictionRequest, PredictionResponse, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:5000'; // Adjust based on your backend URL

export const predictTimeSeries = async (
  request: PredictionRequest
): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get prediction'
    );
  }
};