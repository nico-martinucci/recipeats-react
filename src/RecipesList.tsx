import RecipeatsApi from "./api";
import { useState, useEffect } from "react";
import RecipesListItem from "./RecipesListItem";
import { Stack, Typography } from "@mui/material";

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
    isLoading: Boolean;
}

export default function RecipesList({ recipes, isLoading }: Props) {

    if (isLoading) return <h1>Loading...</h1>

    return (
        <div className="Recipes">
            <Typography variant="h1" gutterBottom>Recipes</Typography>
            <Stack gap={2}>
                {recipes?.map(r => (<RecipesListItem key={r.id} recipe={r} />))}
            </Stack>
        </div>
    )
}