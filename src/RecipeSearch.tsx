import { TextField } from "@mui/material"

interface Props {
    searchTerm: string
    changeSearchTerm: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RecipeSearch({ searchTerm, changeSearchTerm }: Props) {

    return (
        <TextField
            sx={{ minWidth: "100%" }}
            label="Search"
            variant="standard"
            id="name"
            name="name"
            value={searchTerm}
            onChange={changeSearchTerm}
        />
    )
}