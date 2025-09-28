// src/services/fileProcessor.ts
import type { ProcessedData } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');

// Helper function to read file as base64
const fileToGenerativePart = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processFile = async (file: File): Promise<ProcessedData> => {
  const startTime = performance.now();
  
  try {
    // For text files, we'll read the content directly
    if (file.type.startsWith('text/')) {
      const text = await file.text();
      return {
        text,
        metadata: {
          pageCount: 1,
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
          charCount: text.length,
          fileType: file.type,
          documentType: 'text',
        },
        processingStats: {
          startTime,
          endTime: performance.now(),
          duration: performance.now() - startTime,
        },
      };
    }

    // For other file types, use Google's Generative AI with v1beta endpoint
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        apiVersion: 'v1beta'
      }
    });
    
    // Convert file to base64
    const base64Data = await fileToGenerativePart(file);
    
    const prompt = `Extract and structure the key information from this document. 
    Provide a summary and key points in the following JSON format:
    {
      "summary": "Brief summary of the document",
      "keyPoints": ["point 1", "point 2", "point 3"],
      "metadata": {
        "documentType": "Type of document",
        "pageCount": 1
      }
    }`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const responseText = response.text();
    
    // Try to parse the response as JSON
    let processedData;
    try {
      // Extract JSON from markdown code block if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      processedData = JSON.parse(jsonString);
    } catch (e) {
      // If parsing fails, use the raw text as the summary
      processedData = {
        summary: responseText,
        keyPoints: [],
        metadata: {
          documentType: 'unknown',
          pageCount: 1,
        },
      };
    }

    const text = processedData?.summary || 'No content extracted';

    return {
      text,
      metadata: {
        pageCount: processedData?.metadata?.pageCount || 1,
        wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
        charCount: text.length,
        fileType: file.type,
        documentType: processedData?.metadata?.documentType || 'unknown',
      },
      processingStats: {
        startTime,
        endTime: performance.now(),
        duration: performance.now() - startTime,
      },
      structuredData: processedData,
    };
  } catch (error) {
    console.error('Error processing file with Google GenAI:', error);
    // Fallback to basic file reading if AI processing fails
    try {
      const text = await file.text();
      return {
        text,
        metadata: {
          pageCount: 1,
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
          charCount: text.length,
          fileType: file.type,
          documentType: 'unknown',
        },
        processingStats: {
          startTime,
          endTime: performance.now(),
          duration: performance.now() - startTime,
        },
      };
    } catch (fallbackError) {
      console.error('Fallback file reading failed:', fallbackError);
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = [
    'text/csv', 
    'application/pdf', 
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Supported types: ${validTypes.join(', ')}` 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit` 
    };
  }

  return { valid: true };
};