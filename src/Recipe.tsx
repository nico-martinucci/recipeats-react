import RecipeItem from "./RecipeItem";
import RecipeStep from "./RecipeStep";
import RecipeatsApi from "./api";
import { useState, useEffect } from "react";

export interface IRecipeItem {
    amount: number;
    description: string | null;
    id: number;
    ingredient: string;
    order: number;
    unit: string | null;
}

export interface IRecipeStep {
    description: string;
    id: number;
    order: number;
}

export interface IRecipeNote {
    id: number;
    note: string;
    timeStamp: string;
}

interface IRecipe {
    name: string;
    description: string;
    createdBy: string;
    id: number;
    mealName: string;
    typeName: string;
    items: IRecipeItem[];
    steps: IRecipeStep[];
    notes: IRecipeNote[];
    private: false;
}

export default function Recipe() {
    const [recipe, setRecipe] = useState<IRecipe>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    useEffect(function () {
        async function getRecipe() {
            let recipe = await RecipeatsApi.getRecipeById(1);
            setRecipe(recipe);
            setIsLoading(false);
        }

        getRecipe();
    }, [])

    console.log("recipe", recipe);

    if (isLoading) return <h1>Loading...</h1>

    return (
        <>
            <h1>{recipe?.name}</h1>
            <h3>{recipe?.description}</h3>
            <ul>
                {recipe?.items.map(i => (
                    <RecipeItem item={i} />
                ))}
            </ul>
            <ol>
                {recipe?.steps.map(s => (
                    <RecipeStep step={s} />
                ))}
            </ol>
        </>
    )
}