import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IIngredient } from "./RecipeAddForm";
import { FORM_CLEAR_DELAY_MSECS } from "./globalVariables";

interface Props {
    open: boolean;
    toggleClose: () => void;
    addLocalIngredient: (ingredient: IIngredient) => void;
}

interface INewIngredientEntryData {
    name: string;
    description: string;
    category: string;
}

interface ICategory {
    name: string;
    description: string;
}

const initialData = {
    name: "",
    description: "",
    category: ""
}

/**
 * AddNewIngredientDialog: dialog to add a new ingredient to the database.
 * 
 * Props:
 * - open: whether or not the dialog should currently be showing
 * - toggleOpen: function to change the value of open, closing the dialog
 * - addLocalIngredient: function to add an ingredient posted to the API to the
 *      locally stored list of available ingredients, making it available for
 *      immediate use without another API call.
 * 
 * State:
 * - formData: controlled form component value state
 * - categories: list of ingredient category options
 * - isCategoriesLoading: whether or not categories list has loaded
 * 
 * RecipeAddForm -> AddNewIngredientDialog
 */
export default function AddNewIngredientDialog({ open, toggleClose, addLocalIngredient }: Props) {
    const [formData, setFormData] = useState<INewIngredientEntryData>(initialData);
    const [categories, setCategories] = useState<ICategory[]>();
    const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

    useEffect(function () {
        async function getIngredientCategories() {
            let categories = await RecipeatsApi.getIngredientCategories();
            setCategories(categories);
            setIsCategoriesLoading(false);
        }

        getIngredientCategories();
    }, [])

    if (isCategoriesLoading) return <h1>Loading...</h1>

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
        event?.preventDefault();
        const ingredient = await RecipeatsApi.addNewIngredient(formData);
        addLocalIngredient(ingredient);
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
        <Dialog open={open}>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <DialogContentText>
                        Please fill out the information below to add a new
                        ingredient to the database.
                    </DialogContentText>
                    <Stack gap={2} sx={{ mb: 4 }}>
                        <TextField
                            sx={{ minWidth: "100%" }}
                            label="Ingredient"
                            variant="standard"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            required
                        />
                        <TextField
                            sx={{ minWidth: "100%" }}
                            label="Description"
                            variant="standard"
                            multiline
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                            <InputLabel id="category-select-label">Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category"
                                name="category"
                                defaultValue=""
                                value={formData.category}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                required
                            >
                                {categories?.map(c => (
                                    <MenuItem value={c.name} key={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}