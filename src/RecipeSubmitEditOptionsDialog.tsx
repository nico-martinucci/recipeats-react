import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem,
    ButtonGroup,
    Box
} from "@mui/material";
import { BaseSyntheticEvent, useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IRecipeNote } from "./Recipe";
import userContext from "./userContext";
import _ from "lodash";

interface Props {
    open: boolean;
    toggleClose: () => void;
}

interface IEditRecipeOptions {
}

interface IButtonStatus {
    selected: boolean;
    // FIXME: change the below to be limited to either "contained" or "outlined"
    variant: "outlined" | "contained";
}

const initialData = {
}

const selectedButton: IButtonStatus = {
    selected: true,
    variant: "contained"
}

const unselectedButton: IButtonStatus = {
    selected: false,
    variant: "outlined"
}

export default function RecipeSubmitEditOptionsDialog({ open, toggleClose }: Props) {
    const [formData, setFormData] = useState<IEditRecipeOptions>(initialData);
    const [updateStatus, setUpdateStatus] = useState<IButtonStatus>(selectedButton);
    const [createStatus, setCreateStatus] = useState<IButtonStatus>(unselectedButton);

    const user = useContext(userContext);

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

    async function handleSubmit(evt: React.MouseEvent) {

    }

    function handleButtonGroupClick(evt: BaseSyntheticEvent) {
        evt.preventDefault();

        if (evt.target.id === "create-button") {
            setCreateStatus({ ...selectedButton });
            setUpdateStatus({ ...unselectedButton })
        }

        if (evt.target.id === "update-button") {
            setUpdateStatus({ ...selectedButton })
            setCreateStatus({ ...unselectedButton })
        }
    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Update or Create</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom>
                    Do you want to update the current recipe with these changes or create a new recipe?
                </DialogContentText>
                <form>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        <Box display="flex" justifyContent="center">
                            <ButtonGroup>
                                <Button
                                    id="update-button"
                                    variant={updateStatus.variant}
                                    onClick={handleButtonGroupClick}
                                >
                                    Update current recipe
                                </Button>
                                <Button
                                    id="create-button"
                                    variant={createStatus.variant}
                                    onClick={handleButtonGroupClick}
                                >
                                    Create new recipe
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}