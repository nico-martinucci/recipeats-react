import { IRecipeSummary } from "./RecipesList";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

interface Props {
    recipe: IRecipeSummary;
}

export default function RecipesListItem({ recipe }: Props) {
    return (
        <div className="RecipesListItem">
            <Typography variant="h5">
                <Link to={`${recipe.id}`} className="remove-link">
                    {recipe.name}
                </Link>
            </Typography>
            <Typography variant="body1">{recipe.description}</Typography>
            <Typography variant="subtitle2" gutterBottom>
                By {recipe.createdBy} | {recipe.mealName}, {recipe.typeName}
            </Typography>
        </div>
    )
}