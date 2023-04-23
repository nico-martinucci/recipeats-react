import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import RecipeatsApi from "./api";
import { IIngredient } from "./RecipeAddForm";

interface Props {
    open: boolean;
    toggleOpen: () => void;
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

export default function AddNewIngredientDialog({ open, toggleOpen, addLocalIngredient }: Props) {
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

    async function handleSubmit(evt: React.MouseEvent) {
        const ingredient = await RecipeatsApi.addNewIngredient(formData);
        addLocalIngredient(ingredient);
        setFormData(initialData);
        toggleOpen();
    }

    return (
        <div>
            <Dialog open={open} onClose={toggleOpen}>
                <DialogTitle>Add New Ingredient</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill out the information below to add a new
                        ingredient to the database.
                    </DialogContentText>
                    <form>
                        <Stack gap={2} sx={{ mb: 4 }}>

                            <TextField
                                sx={{ minWidth: "100%" }}
                                label="Ingredient"
                                variant="standard"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                                >
                                    {categories?.map(c => (
                                        <MenuItem value={c.name} key={c.name}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}