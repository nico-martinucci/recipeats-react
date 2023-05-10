import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingSpinner() {
    return (
        <Box sx={{ display: 'flex', justifyContent: "center" }} mt={3}>
            <CircularProgress />
        </Box>
    )
}