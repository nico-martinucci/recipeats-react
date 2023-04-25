import { useState, useEffect, useContext } from "react"
import RecipesList from "./RecipesList"
import RecipeAddForm from "./RecipeAddForm"
import RecipeSearch from "./RecipeSearch"
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { IRecipeSummary } from "./RecipesList";
import RecipeatsApi from "./api";
import userContext from "./userContext";

export default function RecipesHome() {
    const [isAddingRecipe, setIsAddingRecipe] = useState<Boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [recipes, setRecipes] = useState<IRecipeSummary[]>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    const user = useContext(userContext);

    useEffect(function () {
        async function getRecipes() {
            let recipes = await RecipeatsApi.getAllRecipes(searchTerm);
            setRecipes(recipes);
            setIsLoading(false);
        }

        getRecipes();
    }, [searchTerm])

    function showAddRecipeForm() {
        setIsAddingRecipe(true);
    }

    function toggleIsAddingRecipeOff() {
        setIsAddingRecipe(false);
    }

    function changeSearchTerm(evt: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(evt.target.value);
    }

    return (
        <Container>
            {!isAddingRecipe &&
                <>
                    {user && <Button variant="contained" onClick={showAddRecipeForm}>Add a recipe</Button>}
                    <RecipeSearch searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} />
                    <RecipesList recipes={recipes} isLoading={isLoading} />
                </>
            }
            {isAddingRecipe &&
                <>
                    <RecipeAddForm toggleFormOff={toggleIsAddingRecipeOff} mode="add" />
                </>
            }
        </Container>
    )
}