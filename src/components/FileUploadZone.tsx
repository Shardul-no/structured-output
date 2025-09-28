// src/components/FileUploadZone.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  isUploading: boolean;
}

export const FileUploadZone = ({ onFilesAdded, isUploading }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
    setIsDragging(false);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={isDragging ? 8 : 2}
      sx={{
        p: 4,
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        cursor: isUploading ? 'progress' : 'pointer',
        textAlign: 'center',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <>
          <CircularProgress />
          <Typography>Processing files...</Typography>
        </>
      ) : (
        <>
          <UploadIcon fontSize="large" color={isDragging ? 'primary' : 'action'} />
          <Typography variant="h6">
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select files'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: CSV, PDF, TXT (Max 10MB)
          </Typography>
        </>
      )}
    </Paper>
  );
};