import axios from "axios";
import { IRecipe, IRecipeBasics, IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe"
import { IIngredient } from "./RecipeAddForm";
import { ISignupFormData } from "./SignupForm";
import { ILoginFormData } from "./LoginForm";
import { IUploadPhotoEntryData } from "./UploadRecipePhotoDialog";

// TODO: update this to environ variable down the road
const BASE_URL = import.meta.env.VITE_API_URL;

export default class RecipeatsApi {

    // TODO: get rid of once JWTs are stored in LS
    static token = import.meta.env.VITE_API_TOKEN;

    static async request(endpoint: string, data = {}, method = "get", addlHeaders = {}) {

        const url = `${BASE_URL}/${endpoint}`;
        const headers = {
            ...addlHeaders,
            Authorization: `${RecipeatsApi.token}`
        };
        const params = (method === "get")
            ? data
            : {};

        console.debug("API Call:", endpoint, data, method, headers);
        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err: any) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // // Individual API routes

    static async fetchUserData(username: string) {
        let res = await this.request(`users/${username}`);

        return res.user;
    }

    static async signupUser(data: ISignupFormData) {
        let res = await this.request(`users/signup`, data, "post");

        return res.token;
    }

    static async verifyUserEmail(token: string | null) {
        let res = await this.request("users/verify", { token }, "post");

        return res.user;
    }

    static async loginUser(data: ILoginFormData) {
        let res = await this.request("users/login", data, "post");
        console.log("res in loginUser static method", res);
        return res.token
    }

    static async getAllRecipes(name = "") {
        let res = await this.request("recipes/", { name });

        return res.recipes;
    }

    static async getRecipeById(id: number) {
        let res = await this.request(`recipes/${id}`);

        return res.recipe;
    }

    static async addNewRecipe(recipe: IRecipe) {
        let res = await this.request("recipes/", recipe, "post");

        return res.recipe;
    }

    static async addNewIngredient(ingredient: IIngredient) {
        let res = await this.request("ingredients/", ingredient, "post");

        return res.ingredient
    }

    static async addNoteToRecipe(noteData: IRecipeNote, recipeId: number) {
        let res = await this.request(
            `recipes/${recipeId}/notes`,
            noteData,
            "post"
        );

        return res.note;
    }

    static async addRecipePhoto(photoData: FormData, recipeId: number) {
        let res = await this.request(
            `recipes/${recipeId}/photos`,
            photoData,
            "post",
            { "Content-Type": "multipart/form-data" }
        )

        return res.newPhoto;
    }

    static async updateRecipeBasics(basicData: IRecipeBasics, recipeId: number | undefined) {
        let res = await this.request(
            `recipes/${recipeId}/basics`,
            basicData,
            "put"
        );

        return res.newBasics;
    }

    static async updateRecipeItems(itemsData: { items: IRecipeItem[] }, recipeId: number) {
        let res = await this.request(
            `recipes/${recipeId}/items`,
            itemsData,
            "put"
        );

        return res.newItems;
    }

    static async updateRecipeSteps(stepsData: { steps: IRecipeStep[] }, recipeId: number) {
        let res = await this.request(
            `recipes/${recipeId}/steps`,
            stepsData,
            "put"
        );

        return res.newSteps;
    }

    static async updateRecipeNotes(
        notesData: { notes: IRecipeNote[], username: string | undefined },
        recipeId: number
    ) {
        let res = await this.request(
            `recipes/${recipeId}/notes`,
            notesData,
            "put"
        );

        return res.newNotes;
    }

    static async getAllIngredients(name = "") {
        let res = await this.request("ingredients/");

        return res.ingredients;
    }

    static async getMeals() {
        let res = await this.request("meals/");

        return res.meals;
    }

    static async getTypes() {
        let res = await this.request("types/");

        return res.types;
    }

    static async getUnits() {
        let res = await this.request("units/");

        return res.units;
    }

    static async getIngredientCategories() {
        let res = await this.request("categories/");

        return res.categories;
    }
}
