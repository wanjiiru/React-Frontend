import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomSnackbar({ toastInfo, handleToastClose }){
    return (
        <Snackbar anchorOrigin={{ vertical:"top", horizontal:"center" }} open={toastInfo.open} autoHideDuration={3500} onClose={handleToastClose}>
            <Alert onClose={handleToastClose} severity={toastInfo.toastClass} sx={{ width: '100%' }}>
                <Typography gutterBottom sx={{ m:0 }} variant="p">{toastInfo.message}</Typography>
            </Alert>
        </Snackbar>
    );
}