import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ISnackbarContent } from './App';

interface Props {
    open: boolean;
    toggleSnackbarOpen: (isOpen: boolean) => void;
    content: ISnackbarContent | undefined
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GlobalSnackbar({ open, toggleSnackbarOpen, content }: Props) {

    function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }

        toggleSnackbarOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={content?.severity} sx={{ width: '100%' }}>
                {content?.message}
            </Alert>
        </Snackbar>
    )
}