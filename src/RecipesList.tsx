import RecipeatsApi from "./api";
import { useState, useEffect } from "react";
import RecipesListItem from "./RecipesListItem";

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

export default function RecipesList() {
    const [recipes, setRecipes] = useState<IRecipeSummary[]>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    useEffect(function () {
        async function getRecipes() {
            let recipes = await RecipeatsApi.getAllRecipes();
            setRecipes(recipes);
            setIsLoading(false);
        }

        getRecipes();
    }, [])

    if (isLoading) return <h1>Loading...</h1>

    return (
        <div className="Recipes">
            <h1>Recipes</h1>
            {recipes?.map(r => (<RecipesListItem key={r.id} recipe={r} />))}
        </div>
    )
}