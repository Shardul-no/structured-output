// src/types/index.ts
export interface FileMetadata {
    id: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
    progress: number;
    error?: string;
    preview?: string;
  }
  
  export interface ProcessedData {
    text: string;
    metadata: {
      pageCount?: number;
      wordCount: number;
      charCount: number;
      fileType: string;
    };
    structuredData?: any[];
    processingStats: {
      startTime: number;
      endTime: number;
      duration: number;
    };
    confidenceScores?: {
      [key: string]: number;
    };
  }
  
  export interface ApiResponse {
    success: boolean;
    data?: ProcessedData;
    error?: string;
    timestamp: string;
  }