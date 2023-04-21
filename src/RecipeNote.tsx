import { Typography } from "@mui/material";
import { IRecipeNote } from "./Recipe";

interface Props {
    note: IRecipeNote;
}

export default function RecipeNote({ note }: Props) {
    return (
        <li>
            <Typography variant="body1">{note.note}</Typography>
        </li>
    )
}