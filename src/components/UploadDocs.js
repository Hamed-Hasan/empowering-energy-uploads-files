import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Grid, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';

const UploadDocs = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [open, setOpen] = useState(false);

  const isFileDuplicate = (fileName) => {
    return uploadedFiles.some((file) => file.name === fileName);
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    if (Array.isArray(acceptedFiles)) {
      // Update the state with the new files (filter out duplicates)
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.filter((file) => !isFileDuplicate(file.name)),
      ]);

      // Initialize uploading state for each new file
      setUploadingFiles((prevUploadingFiles) => [
        ...prevUploadingFiles,
        ...acceptedFiles
          .filter((file) => !isFileDuplicate(file.name))
          .map((file) => ({ name: file.name, isLoading: true })),
      ]);

      // Simulate file upload delay (remove this in actual implementation)
      acceptedFiles
        .filter((file) => !isFileDuplicate(file.name))
        .forEach((file) => {
          setTimeout(() => {
            handleFileUpload(file.name);
          }, 1000);
        });
    }
  }, [uploadedFiles]);

  const removeFile = (fileName) => {
    // Remove the specific file from the state
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    // Remove the corresponding uploading state
    setUploadingFiles((prevUploadingFiles) => prevUploadingFiles.filter((file) => file.name !== fileName));
    // Open the Snackbar
    setOpen(true);
  };

  const clearAllFiles = () => {
    // Clear all uploaded files and uploading states
    setUploadedFiles([]);
    setUploadingFiles([]);
  };

  const handleFileUpload = (fileName) => {
    // Simulate file upload completion (remove this in actual implementation)
    setUploadingFiles((prevUploadingFiles) =>
      prevUploadingFiles.map((file) =>
        file.name === fileName ? { ...file, isLoading: false } : file
      )
    );
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Your File was Removed successfully."
        variant="soft"
        color="success"
      />

      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <p>Selected Files:</p>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={file.name}>
                <ListItemText primary={file.name} />
               
                  <IconButton onClick={() => removeFile(file.name)}>
                    <span>x</span>
                  </IconButton>
               
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" color="secondary" onClick={clearAllFiles}>
            Clear All
          </Button>
        </div>
      )}
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={onDrop}
            disabled={uploadingFiles.some((file) => file.isLoading)}
          >
            Upload Files
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #eeeeee',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default UploadDocs;
