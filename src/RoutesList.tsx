import { Routes, Route } from "react-router-dom"
import RecipesHome from "./RecipesHome"
import Recipe from "./Recipe"
import HomePage from "./HomePage"
import SignupForm, { ISignupFormData } from "./SignupForm"
import VerifyEmail from "./VerifyEmail"

interface Props {
    signup: (data: ISignupFormData) => void;
    setLocalStorageToken: (token: string) => void;
}

export default function RoutesList({ signup, setLocalStorageToken }: Props) {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupForm signup={signup} />} />
            <Route path="/recipes" element={<RecipesHome />} />
            <Route path="/recipes/:recipeId" element={<Recipe />} />
            <Route path="/verify" element={<VerifyEmail setLocalStorageToken={setLocalStorageToken} />} />
        </Routes>
    )
}