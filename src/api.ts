import axios from "axios";
import { IRecipe, IRecipeNote } from "./Recipe"

// TODO: update this to environ variable down the road
const BASE_URL = import.meta.env.VITE_API_URL;

class RecipeatsApi {

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

    static async addNoteToRecipe(noteData: IRecipeNote, recipeId: number) {
        let res = await this.request(
            `recipes/${recipeId}/notes`,
            noteData,
            "post"
        )

        return res.note;
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

    // /** Get companies (filtered by name if not undefined) */

    // static async getCompanies(nameLike: str) {
    //     let res = await this.request("companies", { nameLike });
    //     return res.companies;
    // }

    // /** Get details on a company by handle. */

    // static async getCompany(handle) {
    //     let res = await this.request(`companies/${handle}`);
    //     return res.company;
    // }

    // /** Get list of jobs (filtered by title if not undefined) */

    // static async getJobs(title) {
    //     let res = await this.request("jobs", { title });
    //     return res.jobs;
    // }
}

export default RecipeatsApi;
