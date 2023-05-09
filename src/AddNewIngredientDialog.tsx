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

    async function handleSubmit() {
        event?.preventDefault();
        const ingredient = await RecipeatsApi.addNewIngredient(formData);
        addLocalIngredient(ingredient);
        setFormData(initialData);
        toggleOpen();
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event?.key === "Enter") {
            event?.preventDefault();
            event?.stopPropagation();
            handleSubmit();
        }
    }

    return (
        <Dialog open={open} onClose={toggleOpen}>
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
                    <Button onClick={toggleOpen}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}