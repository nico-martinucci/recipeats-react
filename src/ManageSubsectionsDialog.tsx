import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import userContext from "./userContext";
import _ from "lodash";
import { IconButton } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { FORM_CLEAR_DELAY_MSECS } from "./globalVariables";
import { ISubsection } from "./Recipe"


interface Props {
    open: boolean;
    toggleClose: () => void;
    subsections: ISubsection[];
    updateSubsections: (subsections: ISubsection[]) => void;
    removeDeletedSubsectionsFromItems: (subsections: ISubsection[]) => void;
}



interface ISubsectionEntryData {
    subsections: ISubsection[];
}

// const initialData = {
//     subsections: []
// }

const sampleSubsections = [
    {
        key: "6",
        subsection: "Filling"
    },
    {
        key: "7",
        subsection: "Cake"
    },
    {
        key: "8",
        subsection: "Frosting"
    }
]

/**
 * 
 */
export default function ManageSubsectionsDialog({
    open,
    toggleClose,
    subsections = sampleSubsections,
    updateSubsections,
    removeDeletedSubsectionsFromItems
}: Props) {
    const [formData, setFormData] = useState<ISubsectionEntryData>({ subsections });

    const user = useContext(userContext);

    function handleNestedChange(
        evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { value, id } = evt.target;
        const [list, data, idx] = id.split("-");

        console.log("value", value, "id", id);

        setFormData((curr) => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].map((s: ISubsection) => {
                if (s.key !== idx) return s
                return {
                    ...s,
                    [data]: value
                }
            })
        }))
    }

    function onAddSubsectionClick(evt: React.MouseEvent) {
        evt.preventDefault();

        setFormData(curr => ({
            ...curr,
            subsections: [
                ...curr.subsections,
                {
                    subsection: "",
                    key: _.uniqueId()
                }
            ]
        }))
    }

    function deleteDynamicFormItem(evt: React.MouseEvent) {
        const { id } = evt.currentTarget;
        const [list, key] = id.split("-")
        setFormData(curr => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].filter(i => i.key !== key)
        }))
    }

    async function handleSubmit() {
        updateSubsections(formData.subsections);
        removeDeletedSubsectionsFromItems(formData.subsections);
        toggleClose();
    }

    function handleToggleClose() {
        toggleClose();
        setTimeout(() => {
            setFormData({ subsections });
        }, FORM_CLEAR_DELAY_MSECS)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event?.key === "Enter") {
            event?.preventDefault();
            event?.stopPropagation();
            handleSubmit();
        }
    }

    return (
        <Dialog open={open} onClose={toggleClose}>
            <DialogTitle>Manage Ingredient Subsections</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Use this form to add, remove, or edit ingredient sections.
                    These sections will only exist for this recipe.
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        {formData.subsections.map(s =>
                            <Stack direction="row" key={s.key}>
                                <TextField
                                    sx={{ minWidth: "95%" }}
                                    label="Subsection"
                                    variant="standard"
                                    id={`subsections-subsection-${s.key}`}
                                    key={s.key}
                                    name={`subsections-${s.key}`}
                                    value={s.subsection}
                                    onChange={handleNestedChange}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                                <IconButton
                                    id={`subsections-${s.key}`}
                                    color="primary"
                                    onClick={deleteDynamicFormItem}
                                    tabIndex={-1}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>
                    <Button
                        variant="outlined"
                        onClick={onAddSubsectionClick}
                    >
                        Add Subsection
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggleClose}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}