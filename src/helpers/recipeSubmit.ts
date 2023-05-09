import { IRecipe } from "../Recipe";

export function adjustRecipeForSubmit(recipe: IRecipe, username: string) {
    addUserToRecipe(recipe, username);
    changeAmountsToNumberType(recipe);
    addOrderToItemsAndSteps(recipe);
}

function addUserToRecipe(recipe: IRecipe, username: string) {
    recipe.createdBy = username;
}

function changeAmountsToNumberType(recipe: IRecipe) {
    for (let i of recipe.items) {
        i.amount = Number(i.amount);
    }
}

function addOrderToItemsAndSteps(recipe: IRecipe) {
    for (let i = 0; i < recipe.items.length; i++) {
        recipe.items[i].order = i + 1;
    }

    for (let i = 0; i < recipe.steps.length; i++) {
        recipe.steps[i].order = i + 1;
    }
}

//TODO: add in function to strip out empty ingredients, steps, notes