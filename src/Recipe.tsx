import RecipeatsApi from "./api";
import { useState, useEffect } from "react";

export default function Recipe() {
    const [recipe, setRecipe] = useState({
        recipe: null,
        loading: true
    });

    useEffect(function () {
        async function getRecipe() {
            let recipe = await RecipeatsApi.getRecipeById(1);
            setRecipe({
                recipe,
                loading: false
            })
        }

        getRecipe();
    }, [])

    console.log("recipe", recipe);

    return (
        <h1>recipe</h1>
    )
}

/*
useEffect(function getCompanyAndJobsForUser() {
    async function getCompany() {
      setCompany(await JoblyApi.getCompany(handle));
    }

    getCompany();
  }, [handle]);
*/