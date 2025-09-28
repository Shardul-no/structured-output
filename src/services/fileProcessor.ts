// src/services/fileProcessor.ts
import type { ProcessedData } from '../types';
import * as pdf from 'pdf-parse';

declare global {
  interface File {
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
  }
}

export const processFile = async (file: File): Promise<ProcessedData> => {
  const startTime = performance.now();
  let text = '';
  let pageCount = 0;

  try {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdf.default(new Uint8Array(arrayBuffer));
      text = data.text;
      pageCount = data.numpages;
    } else {
      text = await file.text();
    }

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return {
      text,
      metadata: {
        pageCount,
        wordCount,
        charCount,
        fileType: file.type
      },
      processingStats: {
        startTime,
        endTime: performance.now(),
        duration: performance.now() - startTime
      }
    };
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['text/csv', 'application/pdf', 'text/plain'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  return { valid: true };
};