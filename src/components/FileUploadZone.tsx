import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, CircularProgress, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  isUploading: boolean;
  accept?: string | Record<string, string[]>;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFilesAdded, isUploading, accept }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
    setIsDragging(false);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: typeof accept === 'string' ? undefined : (accept || {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }),
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={isDragging ? 8 : 2}
      style={{
        padding: '2rem',
        border: '2px dashed',
        borderColor: isDragging ? '#1976d2' : '#e0e0e0',
        backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.04)' : '#ffffff',
        transition: 'all 0.2s ease-in-out',
        cursor: isUploading ? 'progress' : 'pointer',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1rem'
      }}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <React.Fragment>
          <CircularProgress />
          <Typography>Processing files...</Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <UploadIcon 
            fontSize="large" 
            color={isDragging ? 'primary' : 'action'} 
            style={{
              color: isDragging ? '#1976d2' : 'rgba(0, 0, 0, 0.54)',
              fontSize: '3rem'
            }}
          />
          <Typography variant="h6" style={{ margin: '0.5rem 0' }}>
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select files'}
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV (Max 10MB)
          </Typography>
        </React.Fragment>
      )}
    </Paper>
  );
};

export default FileUploadZone;