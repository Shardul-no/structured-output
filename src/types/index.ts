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

export interface DocumentMetadata {
  documentType?: string;
  pageCount?: number;
  wordCount: number;
  charCount: number;
  fileType: string;
}

export interface ProcessedDocument {
  summary?: string;
  keyPoints?: string[];
  metadata?: {
    documentType?: string;
    pageCount?: number;
  };
}

export interface ProcessedData {
  text: string;
  metadata: DocumentMetadata;
  structuredData?: ProcessedDocument;
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