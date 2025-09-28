// src/App.tsx
import { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { FileUploadZone } from './components/FileUploadZone';
import { FileList } from './components/FileList';
import { processFile } from './services/fileProcessor';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const newFileItems = newFiles.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      status: 'idle' as const,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFileItems]);
    await processFiles(newFileItems);
  };

  const processFiles = async (filesToProcess: FileMetadata[]) => {
    for (const file of filesToProcess) {
      try {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
        ));

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        }

        const fileObj = new File([], file.name, { type: file.type, lastModified: file.lastModified });
        const processedData = await processFile(fileObj);
        
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', progress: 100, preview: processedData.text.substring(0, 200) + '...' } 
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } 
            : f
        ));
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Document Processor
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Upload and process CSV, PDF, and TXT files to extract structured data
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FileUploadZone 
            onFilesAdded={handleFilesAdded} 
            isUploading={isUploading} 
          />
        </Box>

        <FileList files={files} />
      </Container>
    </ThemeProvider>
  );
}

export default App;