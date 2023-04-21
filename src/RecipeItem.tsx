import { IRecipeItem } from "./Recipe"
import { Typography } from "@mui/material";

interface Props {
    item: IRecipeItem;
}

export default function RecipeItem({ item }: Props) {
    let itemText = item.amount
    itemText = item.unit ? (itemText + " " + item.unit) : itemText
    itemText = item.ingredient ? (itemText + " " + item.ingredient) : itemText
    itemText = item.description ? (itemText + ", " + item.description) : itemText

    return (
        <li className="RecipeItem">
            <Typography variant="body1">{itemText}</Typography>
        </li>
    )
}