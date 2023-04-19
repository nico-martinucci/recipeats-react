import { useParams } from "react-router-dom";
import RecipeItem from "./RecipeItem";
import RecipeStep from "./RecipeStep";
import RecipeatsApi from "./api";
import { useState, useEffect } from "react";

export interface IRecipeItem {
    amount: string | number | null;
    description: string;
    id: number | null;
    ingredient: string;
    order: number | null;
    unit: string | null;
    key: string;
}

export interface IRecipeStep {
    description: string | null;
    id: number | null;
    order: number | null;
    key: string;
}

export interface IRecipeNote {
    id: number | null;
    note: string | null;
    username?: string | null;
    key: string;
}

export interface IRecipe {
    name: string;
    description: string;
    createdBy?: string;
    id?: number;
    mealName: string;
    typeName: string;
    items: IRecipeItem[];
    steps: IRecipeStep[];
    notes: IRecipeNote[];
    private: boolean;
}

export default function Recipe() {
    const [recipe, setRecipe] = useState<IRecipe>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    const { recipe_id } = useParams();

    useEffect(function () {
        async function getRecipe() {
            let recipe = await RecipeatsApi.getRecipeById(Number(recipe_id));
            setRecipe(recipe);
            setIsLoading(false);
        }

        getRecipe();
    }, [])

    console.log("recipe", recipe);

    if (isLoading) return <h1>Loading...</h1>

    return (
        <div className="Recipe">
            <h1>{recipe?.name}</h1>
            <h3>{recipe?.description}</h3>
            <ul>
                {recipe?.items.map(i => (
                    <RecipeItem key={i.order} item={i} />
                ))}
            </ul>
            <ol>
                {recipe?.steps.map(s => (
                    <RecipeStep key={s.order} step={s} />
                ))}
            </ol>
        </div>
    )
}