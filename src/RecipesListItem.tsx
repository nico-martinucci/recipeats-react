import { IRecipeSummary } from "./RecipesList";
import { Link } from "react-router-dom";

interface Props {
    recipe: IRecipeSummary;
}

export default function RecipesListItem({ recipe }: Props) {
    return (
        <div className="RecipesListItem">
            <h2><Link to={`${recipe.id}`} className="remove-link">{recipe.name}</Link></h2>
            <p>{recipe.description}</p>
            <p>By {recipe.createdBy} | {recipe.mealName}, {recipe.typeName}</p>
        </div>
    )
}