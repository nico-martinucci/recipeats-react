import { useState } from "react"
import RecipesList from "./RecipesList"
import RecipeAddForm from "./RecipeAddForm"

export default function RecipesHome() {
    const [isAddingRecipe, setIsAddingRecipe] = useState<Boolean>(true);

    function showAddRecipeForm() {
        setIsAddingRecipe(true);
    }

    return (
        <div className="RecipesHome">
            {!isAddingRecipe &&
                <>
                    <button onClick={showAddRecipeForm}>Add a recipe</button>
                    <RecipesList />
                </>
            }
            {isAddingRecipe &&
                <>
                    <RecipeAddForm />
                </>
            }
        </div>
    )
}