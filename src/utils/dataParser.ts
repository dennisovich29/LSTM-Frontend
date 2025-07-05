import Papa from 'papaparse';
import { TimeSeriesData } from '../types';

export const parseCSVData = (csvText: string): TimeSeriesData[] => {
  try {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });

    if (result.errors.length > 0) {
      throw new Error('CSV parsing error: ' + result.errors[0].message);
    }

    const data = result.data as any[];
    const timeSeriesData: TimeSeriesData[] = [];

    data.forEach((row, index) => {
      // Try to find timestamp and value columns
      const timestamp = row.timestamp || row.date || row.time || index.toString();
      const value = parseFloat(row.value || row.price || row.amount || row.y || '0');

      if (!isNaN(value)) {
        timeSeriesData.push({
          timestamp: timestamp.toString(),
          value: value,
        });
      }
    });

    if (timeSeriesData.length === 0) {
      throw new Error('No valid data found in CSV');
    }

    return timeSeriesData;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseTextData = (textData: string): TimeSeriesData[] => {
  try {
    const lines = textData.trim().split('\n');
    const timeSeriesData: TimeSeriesData[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // Try to parse as "timestamp,value" or just "value"
        const parts = trimmedLine.split(',').map(p => p.trim());
        
        if (parts.length >= 2) {
          const value = parseFloat(parts[1]);
          if (!isNaN(value)) {
            timeSeriesData.push({
              timestamp: parts[0],
              value: value,
            });
          }
        } else if (parts.length === 1) {
          const value = parseFloat(parts[0]);
          if (!isNaN(value)) {
            timeSeriesData.push({
              timestamp: index.toString(),
              value: value,
            });
          }
        }
      }
    });

    if (timeSeriesData.length === 0) {
      throw new Error('No valid data found in text');
    }

    return timeSeriesData;
  } catch (error) {
    throw new Error(`Failed to parse text data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateTimeSeriesData = (data: TimeSeriesData[]): string | null => {
  if (data.length === 0) {
    return 'No data provided';
  }

  if (data.length < 2) {
    return 'At least 2 data points are required';
  }

  const hasValidValues = data.some(d => !isNaN(d.value) && isFinite(d.value));
  if (!hasValidValues) {
    return 'No valid numeric values found';
  }

  return null;
};