import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem, Checkbox, Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IRecipeNote } from "./Recipe";
import userContext from "./userContext";
import _ from "lodash";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

interface Props {
    recipeId: number;
    open: boolean;
    toggleClose: () => void;
    updatePhoto: (photoUrl: string) => void;
}

export interface IUploadPhotoEntryData {
    [key: string]: any;
    makeCover: boolean;
    caption: string;
    photo?: File;
    username?: string;
}

const initialData = {
    makeCover: false,
    caption: ""
}

export default function UploadRecipePhotoDialog({ recipeId, open, toggleClose, updatePhoto }: Props) {
    const [formData, setFormData] = useState<IUploadPhotoEntryData>(initialData);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [submitEvent, setSubmitEvent] = useState<boolean>(true);

    const user = useContext(userContext);

    useEffect(function () {
        if (isMounted) {
            setIsLoading(true);
            async function postUploadPhoto() {
                const data = new FormData();

                for (let input in formData) {
                    data.append(input, formData[input]);
                }

                data.append("username", user?.username || "");

                if (selectedPhoto) {
                    data.append("photo", selectedPhoto)
                }

                const newPhoto = await RecipeatsApi.addRecipePhoto(data, recipeId);

                setIsLoading(false);

                if (formData.makeCover) {
                    updatePhoto(newPhoto.photoUrl)
                }

                handleToggleClose();
            }
            postUploadPhoto();
        } else {
            setIsMounted(true);
        }
    }, [submitEvent])

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

    async function handleSubmit() {
        event?.preventDefault();
        setSubmitEvent(curr => !curr);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        console.log("event in handleKeyDown in add new ingredient dialog", event);

        if (event?.key === "Enter") {
            event?.preventDefault();
            event?.stopPropagation();
            handleSubmit();
        }
    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Upload a Photo</DialogTitle>
            <form onSubmit={handleSubmit}>
                {isLoading && <DialogContent>
                    <Typography variant="h1">Loading...</Typography>
                </DialogContent>}
                {!isLoading && <DialogContent>
                    <DialogContentText gutterBottom>
                        Use the form below to upload a new photo for this recipe.
                    </DialogContentText>
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
                            onKeyDown={handleKeyDown}
                        />
                        <FormControlLabel control={<Checkbox
                            id="makeCover"
                            name="makeCover"
                            checked={formData.makeCover}
                            onChange={handleCheckboxChange}
                        />} label="Upload as new cover photo?" />
                    </Stack>
                </DialogContent>}
                <DialogActions>
                    {!isLoading && <>
                        <Button onClick={handleToggleClose}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </>}
                </DialogActions>
            </form>
        </Dialog>
    )
}