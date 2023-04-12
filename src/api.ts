import axios from "axios";

// TODO: update this to environ variable down the road
const BASE_URL = import.meta.env.VITE_API_URL;

class RecipeatsApi {

    // TODO: get rid of once JWTs are stored in LS
    static token = import.meta.env.VITE_API_TOKEN;

    static async request(endpoint: string, data = {}, method = "get", addlHeaders = {}) {

        const url = `${BASE_URL}/${endpoint}`;
        const headers = {
            ...addlHeaders,
            Authorization: `Bearer ${RecipeatsApi.token}`
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

    static async getRecipeById(id: number) {
        console.log("BASE_URL", BASE_URL);
        let res = await this.request(`recipes/${id}`);
        return res.recipe;
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
