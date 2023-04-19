import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";
import RecipeatsApi from "./api";
import "./RecipeAddForm.css"
import _ from "lodash"
import {
    TextField, FormControl, InputLabel, Select, MenuItem, Menu, FormGroup,
    FormControlLabel, Checkbox, Autocomplete, Stack, Button, Grid
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material"
import { IconButton } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { adjustRecipeForSubmit } from "./helpers/recipeSubmit"
import { Navigate } from "react-router-dom";

interface IRecipeEntryData {
    name: string;
    description: string;
    mealName: string;
    typeName: string;
    private: boolean;
    items: IRecipeItem[];
    steps: IRecipeStep[];
    notes: IRecipeNote[];
}

interface IMeal {
    name: string;
    description: string;
}

interface IType {
    name: string;
    description: string;
}

interface IUnit {
    plural: string;
    short: string;
    singular: string;
}

interface IIngredient {
    category: string;
    description: string;
    name: string;
}

interface Props {
    data?: IRecipeEntryData;
}

const initialData = {
    name: "test name",
    description: "test description",
    mealName: "breakfast",
    typeName: "main dish",
    private: false,
    items: [
        {
            amount: "1",
            description: "cooked and cleaned",
            id: null,
            ingredient: "crab",
            order: null,
            unit: "lb",
            key: _.uniqueId(),
        }
    ],
    steps: [
        {
            description: "just eat it",
            id: null,
            order: null,
            key: _.uniqueId(),
        }
    ],
    notes: []
}

export default function RecipeAddForm({ data = initialData }: Props) {
    const [formData, setFormData] = useState<IRecipeEntryData>(data);
    const [meals, setMeals] = useState<IMeal[]>();
    const [isMealsLoading, setIsMealsLoading] = useState<Boolean>(true);
    const [types, setTypes] = useState<IType[]>();
    const [isTypesLoading, setIsTypesLoading] = useState<Boolean>(true);
    const [units, setUnits] = useState<IUnit[]>([{ plural: "", short: "", singular: "" }]);
    const [isUnitsLoading, setIsUnitsLoading] = useState<Boolean>(true);
    const [ingredients, setIngredients] = useState<IIngredient[]>(
        [{ category: "", description: "", name: "" }]
    );
    const [isIngredientsLoading, setIsIngredientsLoading] = useState<Boolean>(true);

    const navigate = useNavigate();

    useEffect(function () {
        async function getFormSelectData() {
            try {
                let meals = await RecipeatsApi.getMeals();
                setMeals(meals);
                setIsMealsLoading(false);
            } catch {
                return
            }

            try {
                let types = await RecipeatsApi.getTypes();
                setTypes(types);
                setIsTypesLoading(false);
            } catch {
                return
            }

            try {
                let units = await RecipeatsApi.getUnits();
                setUnits(units);
                setIsUnitsLoading(false);
            } catch {
                return
            }

            try {
                let ingredients = await RecipeatsApi.getAllIngredients();
                setIngredients(ingredients);
                setIsIngredientsLoading(false);
            } catch {
                return
            }
        }

        getFormSelectData();
    }, [])

    // console.log("types", types)

    function handleChange(
        evt: (SelectChangeEvent | React.ChangeEvent<HTMLInputElement |
            HTMLTextAreaElement>)
    ) {
        const { name, value } = evt.target;

        setFormData((curr) => ({
            ...curr,
            [name]: value,
        }));
    }

    function handleCheckboxChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = evt.target;

        console.log("name", name, "checked", checked);

        setFormData(curr => ({
            ...curr,
            [name]: checked === true
        }))
    }

    // @ts-ignore
    function handleAutocompleteChange(evt, value: (IUnit | IIngredient)) {
        const [list, data, idx, propName] = evt.target.id.split("-");

        setFormData((curr) => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].map((
                x: (IRecipeItem | IRecipeStep | IRecipeNote),
                i: number
            ) => {
                if (i !== +idx) return x
                return {
                    ...x,
                    // @ts-ignore
                    [data]: value ? value[propName] : ""
                }
            })
        }));
    }

    function handleNestedChange(
        evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { value, id } = evt.target;
        const [list, data, idx] = id.split("-");

        setFormData((curr) => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].map((
                x: (IRecipeItem | IRecipeStep | IRecipeNote),
                i: number
            ) => {
                if (i !== +idx) return x
                return {
                    ...x,
                    [data]: value
                }
            })
        }))
    }

    function onAddIngredientClick(evt: React.MouseEvent) {
        evt.preventDefault();
        setFormData(curr => ({
            ...curr,
            items: [
                ...curr.items,
                {
                    amount: "",
                    description: "",
                    id: null,
                    ingredient: "",
                    order: null,
                    unit: "",
                    key: _.uniqueId(),
                }
            ]
        }))
    }

    function onAddStepClick(evt: React.MouseEvent) {
        evt.preventDefault();
        setFormData(curr => ({
            ...curr,
            steps: [
                ...curr.steps,
                {
                    description: "",
                    id: null,
                    order: null,
                    key: _.uniqueId(),
                }
            ]
        }))
    }

    function onAddNoteClick(evt: React.MouseEvent) {
        evt.preventDefault();
        setFormData(curr => ({
            ...curr,
            notes: [
                ...curr.notes,
                {
                    id: null,
                    note: "",
                    key: _.uniqueId(),
                }
            ]
        }))
    }

    function deleteDynamicFormItem(evt: React.MouseEvent) {
        console.log("target", evt.currentTarget);
        const { id } = evt.currentTarget;
        const [list, key] = id.split("-")
        setFormData(curr => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].filter(i => i.key !== key)
        }))
    }

    async function addNewRecipe(evt: React.MouseEvent) {
        evt.preventDefault();
        adjustRecipeForSubmit(formData);

        let newRecipe = await RecipeatsApi.addNewRecipe(formData);
        let notePromises = [];

        for (let note of formData.notes) {
            notePromises.push(RecipeatsApi.addNoteToRecipe(
                {
                    ...note,
                    username: "test"
                },
                newRecipe.id
            ))
        }

        await Promise.allSettled(notePromises);
        console.log("IT WORKED", newRecipe);

        navigate(`/recipes/${newRecipe.id}`);
    }

    if (isMealsLoading || isTypesLoading ||
        isUnitsLoading || isIngredientsLoading
    ) {
        return <h1>Loading...</h1>
    }

    // FIXME: input state handling isn't working for checkbox - check BYBO for how we did it there

    return (
        <div>
            <h1>Add/Edit a Recipe</h1>
            <form>
                <div>
                    <h2>Recipe Basics</h2>
                    <Stack gap={1} sx={{ mb: 4 }}>
                        <div>
                            <TextField
                                sx={{ minWidth: "100%" }}
                                label="Recipe Name"
                                variant="standard"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                sx={{ minWidth: "100%" }}
                                label="Description"
                                variant="standard"
                                multiline
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                <InputLabel id="meal-select-label">Meal</InputLabel>
                                <Select
                                    labelId="meal-select-label"
                                    id="mealName"
                                    name="mealName"
                                    defaultValue=""
                                    value={formData.mealName}
                                    onChange={handleChange}
                                >
                                    {meals?.map(m => (
                                        <MenuItem value={m.name} key={_.uniqueId()}>
                                            {m.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                <InputLabel id="type-select-label">Type</InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    id="typeName"
                                    name="typeName"
                                    defaultValue=""
                                    value={formData.typeName}
                                    onChange={handleChange}
                                >
                                    {types?.map(t => (
                                        <MenuItem value={t.name} key={_.uniqueId()}>
                                            {t.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControlLabel control={<Checkbox
                                id="private"
                                name="private"
                                checked={formData.private}
                                onChange={handleCheckboxChange}
                            />} label="Private Recipe?" />
                        </div>
                    </Stack>
                </div>
                <div>
                    <h2>Ingredients</h2>
                    <Stack gap={1} sx={{ mb: 4 }}>
                        {formData.items.map((i, idx) => (
                            <Stack direction="row" key={i.key}>
                                <Grid2 container spacing={2} xs>
                                    <Grid2 xs={12} sm={2}>
                                        <TextField
                                            // sx={{ maxWidth: "30%" }}
                                            label="Amount"
                                            variant="standard"
                                            fullWidth
                                            id={`items-amount-${idx}`}
                                            value={i.amount}
                                            onChange={handleNestedChange}
                                            size="small"
                                        />
                                    </Grid2>
                                    <Grid2 xs={12} sm={2}>
                                        <Autocomplete
                                            disablePortal
                                            // autoComplete
                                            // autoHighlight
                                            // autoSelect
                                            disableClearable
                                            options={units}
                                            getOptionLabel={u => `${u.short} (${u.plural})`}
                                            id={`items-unit-${idx}-short`}
                                            onChange={handleAutocompleteChange}
                                            renderInput={(params) => <TextField
                                                {...params}
                                                size="small"
                                                label="Unit"
                                                variant="standard"
                                                value={{ label: i.unit?.toString() }}
                                            />}
                                        />
                                    </Grid2>
                                    <Grid2 xs={12} sm={4}>
                                        <Autocomplete
                                            disablePortal
                                            // autoComplete
                                            // autoHighlight
                                            // autoSelect
                                            disableClearable
                                            options={ingredients}
                                            getOptionLabel={i => i.name}
                                            id={`items-ingredient-${idx}-name`}
                                            onChange={handleAutocompleteChange}
                                            renderInput={(params) => <TextField
                                                {...params}
                                                size="small"
                                                label="Ingredient"
                                                variant="standard"
                                                value={{ label: i.ingredient?.toString() }}
                                            />}
                                        />
                                    </Grid2>
                                    <Grid2 xs={12} sm={4}>
                                        <TextField
                                            label="Description"
                                            variant="standard"
                                            fullWidth
                                            id={`items-description-${idx}`}
                                            value={i.description?.toString()}
                                            onChange={handleNestedChange}
                                            size="small"
                                        />
                                    </Grid2>
                                </Grid2>
                                <IconButton
                                    id={`items-${i.key}`}
                                    color="primary"
                                    onClick={deleteDynamicFormItem}
                                    tabIndex={-1}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                    <Button variant="outlined" onClick={onAddIngredientClick}>Add ingredient</Button>
                </div>
                <div>
                    <h2>Steps</h2>
                    <Stack gap={1} sx={{ mb: 4 }}>
                        {formData.steps.map((s, idx) => (
                            <Stack direction="row" key={s.key}>
                                <TextField
                                    sx={{ minWidth: "90%" }}
                                    label={`Step ${idx + 1}`}
                                    variant="standard"
                                    multiline
                                    id={`steps-description-${idx}`}
                                    value={s.description}
                                    onChange={handleNestedChange}
                                />
                                <IconButton
                                    id={`steps-${s.key}`}
                                    color="primary"
                                    onClick={deleteDynamicFormItem}
                                    tabIndex={-1}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                    <Button variant="outlined" onClick={onAddStepClick}>Add step</Button>
                </div>
                <div>
                    <h2>Notes</h2>
                    <Stack gap={1} sx={{ mb: 4 }}>
                        {formData.notes.map((n, idx) => (
                            <Stack direction="row" key={n.key}>
                                <TextField
                                    key={n.key}
                                    sx={{ minWidth: "90%" }}
                                    label={`Note`}
                                    variant="standard"
                                    multiline
                                    id={`notes-note-${idx}`}
                                    value={n.note}
                                    onChange={handleNestedChange}
                                />
                                <IconButton
                                    id={`notes-${n.key}`}
                                    color="primary"
                                    onClick={deleteDynamicFormItem}
                                    tabIndex={-1}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                    <Button variant="outlined" onClick={onAddNoteClick}>Add note</Button>
                </div>
                <Button
                    variant="contained"
                    sx={{ mt: 4 }}
                    onClick={addNewRecipe}
                >
                    Submit recipe
                </Button>
            </form >
        </div >
    )
}