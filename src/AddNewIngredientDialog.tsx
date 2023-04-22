import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle
} from "@mui/material";

interface Props {
    open: boolean;
    toggleOpen: () => void;
}

export default function AddNewIngredientDialog({ open, toggleOpen }: Props) {

    return (
        <div>
            <Dialog open={open} onClose={toggleOpen}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen}>Cancel</Button>
                    <Button onClick={toggleOpen}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}