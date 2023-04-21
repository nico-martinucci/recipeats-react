import { Routes, Route } from "react-router-dom"
import RecipesHome from "./RecipesHome"
import Recipe from "./Recipe"

export default function RoutesList() {
    return (
        <Routes>
            <Route path="/recipes" element={<RecipesHome />} />
            <Route path="/recipes/:recipe_id" element={<Recipe />} />
        </Routes>
    )
}