import { Routes, Route } from "react-router-dom"
import RecipesHome from "./RecipesHome"
import Recipe from "./Recipe"
import HomePage from "./HomePage"

export default function RoutesList() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesHome />} />
            <Route path="/recipes/:recipe_id" element={<Recipe />} />
        </Routes>
    )
}