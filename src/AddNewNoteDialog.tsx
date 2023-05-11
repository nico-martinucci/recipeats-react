import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IRecipeNote } from "./Recipe";
import userContext from "./userContext";
import _ from "lodash";
import { FORM_CLEAR_DELAY_MSECS } from "./globalVariables";

interface Props {
    recipeId: number | undefined;
    open: boolean;
    toggleClose: () => void;
    addLocalNote: (note: IRecipeNote) => void;
}

interface INewNoteEntryData {
    note: string;
}

const initialData = {
    note: ""
}

/**
 * AddNewNoteDialog: dialog to add a new note to the current recipe.
 * 
 * Props:
 * - recipeId: id of current recipe
 * - open: whether or note the dialog should currently be showing
 * - toggleClose: function to change the value of open, close the dialog
 * - addLocalNote: function to add a posted note to the currently open recipe
 * 
 * State:
 * - formData: controlled form component value state
 * 
 * Recipe -> AddNewNoteDialog
 */
export default function AddNewNoteDialog({ recipeId, open, toggleClose, addLocalNote }: Props) {
    const [formData, setFormData] = useState<INewNoteEntryData>(initialData);

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

    async function handleSubmit() {
        const noteData = {
            id: null,
            note: formData.note,
            username: user?.username,
            key: _.uniqueId(),
        }

        const note = await RecipeatsApi.addNoteToRecipe(noteData, recipeId || 0);

        addLocalNote(noteData);
        setFormData(initialData);
        toggleClose();
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event?.key === "Enter") {
            event?.preventDefault();
            event?.stopPropagation();
            handleSubmit();
        }
    }

    /**
     * handleToggleClose: controller function to reset form data and toggle the
     * dialog box closed.
     */
    function handleToggleClose() {
        toggleClose();
        setTimeout(() => {
            setFormData(initialData);
        }, FORM_CLEAR_DELAY_MSECS)
    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Add New Note</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This note will only be visible to the author of this recipe.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        <TextField
                            sx={{ minWidth: "100%" }}
                            label="Note"
                            variant="standard"
                            multiline
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggleClose}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </DialogActions>
        </Dialog>
    )
}