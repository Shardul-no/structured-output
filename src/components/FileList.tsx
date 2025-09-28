// src/components/FileList.tsx
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, LinearProgress } from '@mui/material';
import { InsertDriveFile as FileIcon, Error as ErrorIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { FileMetadata } from '../types/index';

interface FileListProps {
  files: FileMetadata[];
}

export const FileList = ({ files }: FileListProps) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Files
      </Typography>
      <List>
        {files.map((file) => (
          <ListItem 
            key={file.id} 
            divider
            secondaryAction={
              file.status === 'completed' ? (
                <CheckCircleIcon color="success" />
              ) : file.status === 'error' ? (
                <ErrorIcon color="error" />
              ) : null
            }
          >
            <ListItemIcon>
              <FileIcon />
            </ListItemIcon>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <ListItemText 
                primary={file.name} 
                secondary={`${(file.size / 1024).toFixed(1)} KB`} 
              />
              {file.status === 'uploading' && (
                <LinearProgress 
                  variant="determinate" 
                  value={file.progress} 
                  sx={{ mt: 1 }} 
                />
              )}
              {file.error && (
                <Typography variant="caption" color="error">
                  {file.error}
                </Typography>
              )}
              {file.preview && (
                <Typography variant="caption" component="div" sx={{ mt: 1, color: 'text.secondary' }}>
                  Preview: {file.preview}
                </Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};