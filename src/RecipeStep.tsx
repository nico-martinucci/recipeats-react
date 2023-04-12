import { IRecipeStep } from "./Recipe"

interface Props {
    step: IRecipeStep;
}

export default function RecipeItem({ step }: Props) {
    return (
        <li>{step.description}</li>
    )
}