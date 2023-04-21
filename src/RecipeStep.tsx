import { Typography } from "@mui/material";
import { IRecipeStep } from "./Recipe";

interface Props {
    step: IRecipeStep;
}

export default function RecipeItem({ step }: Props) {
    return (
        <li className="RecipeStep">
            <Typography variant="body1">{step.description}</Typography>
        </li>
    )
}