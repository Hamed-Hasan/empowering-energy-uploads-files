import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Grid, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const UploadDocs = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [progressBarColor, setProgressBarColor] = useState('primary');


  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const isFileDuplicate = (fileName) => {
    return uploadedFiles.some((file) => file.name === fileName);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // console.log(acceptedFiles);
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

  const handleUploadButtonClick = () => {
    const formData = new FormData();
  
    // Add each file to the form data
    uploadedFiles.forEach((file) => {
      // Check file size
      if (file.size > 26214400) {
        alert('File size exceeds 25 MB. Please choose a smaller file.');
        return;
      }
  
      formData.append('files', file);
    });
  
    // Check for duplicate files
    const fileNames = uploadedFiles.map((file) => file.name);
    const hasDuplicates = new Set(fileNames).size !== fileNames.length;
    if (hasDuplicates) {
      alert('Duplicate file not allowed.');
      return;
    }
  
    // Show progress bar
    setShowProgressBar(true);
  
    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Update progress to 100 on success
          setProgress(100);
          return response.json();
        } else {
          // Update progress to 0 on failure
          setProgress(0);
          throw new Error('Failed to upload files');
        }
      })
      .then((data) => {
        console.log('Files uploaded successfully:', data);
        // Set the color to 'success' for the progress bar on success
        setProgressBarColor('success');
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
        // Set the color to 'error' for the progress bar on error
        setProgressBarColor('error');
      })
      .finally(() => {
        // Hide the progress bar after the upload is complete (success or failure)
        setTimeout(() => {
          setShowProgressBar(false);
        }, 2000); // You can adjust the timeout duration as needed
      });
  };
  

  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
 

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
        {showProgressBar && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              // variant="determinate"
              value={progress}
              color={progressBarColor} 
              style={{ height: '4px' }}
            />
          </Box>
        )}
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
            onClick={handleUploadButtonClick}
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
