import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IIngredient } from "./RecipeAddForm";
import { FORM_CLEAR_DELAY_MSECS } from "./globalVariables";
import LoadingSpinner from "./LoadingSpinner";
import Typography from "@mui/material";
import snackbarContext from "./snackbarContext";

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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [submitEvent, setSubmitEvent] = useState<boolean>(true);

    const snackbar = useContext(snackbarContext);

    useEffect(function () {
        async function getIngredientCategories() {
            let categories = await RecipeatsApi.getIngredientCategories();
            setCategories(categories);
            setIsCategoriesLoading(false);
        }

        getIngredientCategories();
    }, [])

    useEffect(function () {
        if (isMounted) {
            setIsSubmitting(true);
            async function postAddNewIngredient() {
                const ingredient = await RecipeatsApi.addNewIngredient(formData);

                setTimeout(() => {

                }, 1000)

                setIsSubmitting(false);

                if ("error" in ingredient) {
                    snackbar({
                        message: ingredient.error,
                        severity: "error"
                    })
                    return;
                }

                snackbar({
                    message: `Ingredient added: ${ingredient.name}.`,
                    severity: "success"
                })

                addLocalIngredient(ingredient);
                setFormData(initialData);
                toggleClose();
            }

            postAddNewIngredient();
        } else {
            setIsMounted(true);
        }
    }, [submitEvent])

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
        setSubmitEvent(curr => !curr);
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
        <Dialog open={open} onClose={handleToggleClose}>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <form onSubmit={handleSubmit}>
                {(isCategoriesLoading || isSubmitting) &&
                    <DialogContent>
                        <LoadingSpinner />
                    </DialogContent>}
                {(!isCategoriesLoading && !isSubmitting) &&
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
                    </DialogContent>}
                <DialogActions>
                    <Button onClick={handleToggleClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}