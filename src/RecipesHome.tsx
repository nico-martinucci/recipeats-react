import { useState } from "react"
import RecipesList from "./RecipesList"
import RecipeAddForm from "./RecipeAddForm"
import { Container } from "@mui/material";

export default function RecipesHome() {
    const [isAddingRecipe, setIsAddingRecipe] = useState<Boolean>(true);

    function showAddRecipeForm() {
        setIsAddingRecipe(true);
    }

    return (
        <div className="RecipesHome">
            <Container>
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
            </Container>
        </div>
    )
}