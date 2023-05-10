import RecipeatsApi from "./api";
import { useState, useEffect, useContext } from "react";
import RecipesListItem from "./RecipesListItem";
import { Stack, Typography } from "@mui/material";
import userContext from "./userContext";
import LoadingSpinner from "./LoadingSpinner";

export interface IRecipeSummary {
    createdBy: string;
    description: string;
    id: number;
    mealName: string;
    name: string;
    photoUrl: string | null;
    rating: number | null;
    typeName: string;
}

interface Props {
    recipes: IRecipeSummary[] | undefined;
    isLoading: boolean;
    isShowingFavorites: boolean;
}

export default function RecipesList({ recipes, isLoading, isShowingFavorites }: Props) {

    const user = useContext(userContext);

    let filteredRecipes = recipes ? [...recipes] : [];

    if (isShowingFavorites) {
        filteredRecipes = filteredRecipes.filter(r => user?.favoritedRecipes.has(r.id));
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="Recipes">
            <Typography variant="h1" gutterBottom>Recipes</Typography>
            <Stack gap={2}>
                {filteredRecipes?.map(r => (<RecipesListItem key={r.id} recipe={r} />))}
            </Stack>
        </div>
    )
}