import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem, Checkbox
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IRecipeNote } from "./Recipe";
import userContext from "./userContext";
import _ from "lodash";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

interface Props {
    recipeId: number | undefined;
    open: boolean;
    toggleClose: () => void;
    updatePhoto: (photoUrl: string) => void;
}

interface IUploadPhotoEntryData {
    makeCover: boolean;
    caption: string;
}

const initialData = {
    makeCover: false,
    caption: ""
}

export default function UploadRecipePhotoDialog({ recipeId, open, toggleClose, updatePhoto }: Props) {
    const [formData, setFormData] = useState<IUploadPhotoEntryData>(initialData);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");

    function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const photo = event.target.files && event.target.files[0];
        if (photo) {
            setSelectedPhoto(photo);
            const reader = new FileReader();
            reader.readAsDataURL(photo);
            reader.onload = () => {
                setPreviewPhotoUrl(reader.result as string);
            };
        }
    }

    function handleChange(
        evt: (SelectChangeEvent | React.ChangeEvent<HTMLInputElement |
            HTMLTextAreaElement>)
    ) {
        const { name, value } = evt.target;

        setFormData((curr) => ({
            ...curr,
            [name]: value,
        }));
    }

    function handleCheckboxChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = evt.target;

        setFormData(curr => ({
            ...curr,
            [name]: checked === true
        }))
    }

    function handleToggleClose() {
        setFormData(initialData);
        setSelectedPhoto(null);
        setPreviewPhotoUrl("");
        toggleClose();
    }

    async function handleSubmit(evt: React.MouseEvent) {

    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Upload a Photo</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    Use the form below to upload a new photo for this recipe.
                </DialogContentText>
                <form>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<AddAPhotoOutlinedIcon />}
                            sx={{ marginRight: "1rem" }}
                        >
                            Upload Photo
                            <input type="file" accept=".jpg,.jpeg,.png" hidden onChange={handlePhotoChange} />
                        </Button>
                        {previewPhotoUrl && (
                            <img src={previewPhotoUrl} alt="Preview" style={{ maxWidth: '100%' }} />
                        )}
                        <TextField
                            sx={{ minWidth: "100%" }}
                            label="Caption (optional)"
                            variant="standard"
                            multiline
                            id="caption"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                        />
                        <FormControlLabel control={<Checkbox
                            id="makeCover"
                            name="makeCover"
                            checked={formData.makeCover}
                            onChange={handleCheckboxChange}
                        />} label="Upload as new cover photo?" />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}