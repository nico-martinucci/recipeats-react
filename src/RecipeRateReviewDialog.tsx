import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem, Checkbox
} from "@mui/material";
import { useEffect, useState } from "react";


interface Props {
    open: boolean;
    toggleClose: () => void;
    initialData: IRateReviewEntryData;
}

interface IRateReviewEntryData {
    isStarred: boolean;
}

const defaultData = {
    isStarred: false
}

export default function RecipeRateReviewDialog({
    open,
    toggleClose,
    initialData = defaultData
}: Props) {
    const [formData, setFormData] = useState<IRateReviewEntryData>(initialData);

    // function handleChange(
    //     evt: (SelectChangeEvent | React.ChangeEvent<HTMLInputElement |
    //         HTMLTextAreaElement>)
    // ) {
    //     const { name, value } = evt.target;

    //     setFormData((curr) => ({
    //         ...curr,
    //         [name]: value,
    //     }));
    // }

    function handleCheckboxChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = evt.target;

        setFormData(curr => ({
            ...curr,
            [name]: checked === true
        }))
    }

    function handleSubmit(evt: React.MouseEvent) {

    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Rate & Review</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill out the information below to rate and review
                    this recipe.
                </DialogContentText>
                <form>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        <FormControlLabel control={<Checkbox
                            id="isStarred"
                            name="isStarred"
                            checked={formData.isStarred}
                            onChange={handleCheckboxChange}
                        />} label="Favorite?" />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );

}