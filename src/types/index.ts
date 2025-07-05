export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface PredictionRequest {
  data: TimeSeriesData[];
  steps?: number;
}

export interface PredictionResponse {
  original: TimeSeriesData[];
  predicted: TimeSeriesData[];
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  details?: string;
}