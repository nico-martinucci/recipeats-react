import { IRecipeItem } from "./Recipe"

interface Props {
    item: IRecipeItem;
}

export default function RecipeItem({ item }: Props) {
    return (
        <li className="RecipeItem">
            {item.amount}
            {item.unit}
            {item.ingredient}
            {item.description}
        </li>
    )
}