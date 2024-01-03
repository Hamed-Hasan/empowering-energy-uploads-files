import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadDocs from './UploadDocs';


const FileUpload = () => {
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
          padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
          padding: theme.spacing(1),
        },
      }));
      
      const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
        const handleClose = () => {
          setOpen(false);
        };

    return (
        <Grid container spacing={6} flex height={500} justifyContent="center" alignItems="center">
        <Grid item xl={9} md={8} xs={12}>
            this left colum
        </Grid>
 
        <Grid item xl={3} md={4} xs={12}>
        <Button
      variant="outlined"
      startIcon={<CloudUploadIcon />}
      onClick={handleClickOpen}
    >
      Open dialog
    </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
     

        <DialogContent dividers>
        <UploadDocs/>
        </DialogContent>
      </BootstrapDialog>
        </Grid>
      </Grid>
      
    );
};

export default FileUpload;