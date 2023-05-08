import { useState, useEffect, useContext } from "react"
import RecipesList from "./RecipesList"
import RecipeAddForm from "./RecipeAddForm"
import RecipeSearch from "./RecipeSearch"
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { IRecipeSummary } from "./RecipesList";
import RecipeatsApi from "./api";
import userContext from "./userContext";
import RecipesHomeSpeedDial from "./RecipesHomeSpeedDial";

/**
 * RecipesHome: Container component for recipes, including list of recipes and
 * add new recipe form.
 * 
 * Props: N/A
 * 
 * State:
 * - isAddingRecipe: whether add recipe form is showing or not
 * - searchTerm: currently entered search term; updates on entry
 * - recipes: list of recipes pulled from api
 * - isLoading: loading state for api call
 * - isShowingFavorites: whether just favorites or all recipes should be shown
 * 
 * RoutesList -> RecipesHome -> RecipeSearch | RecipesList | 
 *      RecipesHomeSpeedDial | RecipeAddForm
 */
export default function RecipesHome() {
    const [isAddingRecipe, setIsAddingRecipe] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [recipes, setRecipes] = useState<IRecipeSummary[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isShowingFavorites, setIsShowingFavorites] = useState<boolean>(false);

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

    function toggleIsShowingFavorites() {
        setIsShowingFavorites(curr => !curr);
    }

    return (
        <Container>
            {!isAddingRecipe &&
                <>
                    <RecipeSearch searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} />
                    <RecipesList
                        recipes={recipes}
                        isLoading={isLoading}
                        isShowingFavorites={isShowingFavorites}
                    />
                    {user && <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                        <RecipesHomeSpeedDial
                            showAddRecipeForm={showAddRecipeForm}
                            toggleIsShowingFavorites={toggleIsShowingFavorites}
                            isShowingFavorites={isShowingFavorites}
                        />
                    </div>}
                </>
            }
            {isAddingRecipe &&
                <>
                    <RecipeAddForm
                        toggleFormOff={toggleIsAddingRecipeOff}
                        mode="add"
                        recipeId={-1}
                    />
                </>
            }
        </Container>
    )
}