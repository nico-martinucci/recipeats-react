import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Stack, FormControl, InputLabel, Select, FormControlLabel,
    MenuItem, Checkbox
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import userContext from "./userContext";
import RecipeatsApi from "./api";


interface Props {
    open: boolean;
    toggleClose: () => void;
    initialData: IRateReviewEntryData;
    recipeId: number;
}

interface IRateReviewEntryData {
    isStarred: boolean | undefined;
}

const defaultData = {
    isStarred: false
}

export default function RecipeRateReviewDialog({
    open,
    toggleClose,
    initialData = defaultData,
    recipeId
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

    const user = useContext(userContext);

    console.log("initialData in RecipeRateReviewDialog", initialData)

    function handleCheckboxChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = evt.target;

        setFormData(curr => ({
            ...curr,
            [name]: checked === true
        }))
    }

    function handleToggleClose() {
        toggleClose();
    }

    async function handleSubmit(evt: React.MouseEvent) {
        if (formData.isStarred && !user?.favoritedRecipes.has(recipeId)) {
            let newFavorite = await RecipeatsApi.favoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            console.log("newFavorite api response in RecipeRateReviewDialog", newFavorite);
        } else if (!formData.isStarred && user?.favoritedRecipes.has(recipeId)) {
            let deletedFavorite = await RecipeatsApi.unfavoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            console.log("deletedFavorite api response in RecipeRateReviewDialog", deletedFavorite);
        }

        handleToggleClose();
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
                <Button onClick={handleToggleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );

}