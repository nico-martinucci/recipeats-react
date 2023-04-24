import { IRecipe } from "../Recipe";

export function adjustRecipeForSubmit(recipe: IRecipe) {
    addUserToRecipe(recipe);
    changeAmountsToNumberType(recipe);
    addOrderToItemsAndSteps(recipe);
}

function addUserToRecipe(recipe: IRecipe) {
    // TODO: change from hardcoded test user to current user when local storage is live
    recipe.createdBy = "test";
}

function changeAmountsToNumberType(recipe: IRecipe) {
    for (let i of recipe.items) {
        i.amount = Number(i.amount);
    }
}

function addOrderToItemsAndSteps(recipe: IRecipe) {
    console.log("recipe", recipe);
    for (let i = 0; i < recipe.items.length; i++) {
        recipe.items[i].order = i + 1;
    }

    for (let i = 0; i < recipe.steps.length; i++) {
        recipe.steps[i].order = i + 1;
    }
}

//TODO: add in function to strip out empty ingredients, steps, notes