import { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { IRecipe, IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";
import RecipeatsApi from "./api";
import _ from "lodash"
import {
    TextField, FormControl, InputLabel, Select, MenuItem,
    FormControlLabel, Checkbox, Autocomplete, Stack, Button, Typography
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material"
import { IconButton } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { adjustRecipeForSubmit } from "./helpers/recipeSubmit"
import RecipeAddFormSpeedDial from "./RecipeAddFormSpeedDial";
import AddNewIngredientDialog from "./AddNewIngredientDialog";
import userContext from "./userContext";

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

export interface IIngredient {
    category: string;
    description: string;
    name: string;
}

interface Props {
    data?: IRecipeEntryData;
    toggleFormOff: () => void;
    mode: ("add" | "edit" | "fork");
    recipeId: number | undefined;
    updateFullRecipe?: ((recipe: IRecipe) => void);
}

const initialData = {
    name: "",
    description: "",
    mealName: "",
    typeName: "",
    private: false,
    items: [],
    steps: [],
    notes: []
}

export default function RecipeAddForm({ data = initialData, toggleFormOff, mode, recipeId = 0, updateFullRecipe }: Props) {
    const [formData, setFormData] = useState<IRecipeEntryData>(data);
    const [meals, setMeals] = useState<IMeal[]>();
    const [isMealsLoading, setIsMealsLoading] = useState<boolean>(true);
    const [types, setTypes] = useState<IType[]>();
    const [isTypesLoading, setIsTypesLoading] = useState<boolean>(true);
    const [units, setUnits] = useState<IUnit[]>([{ plural: "", short: "", singular: "" }]);
    const [isUnitsLoading, setIsUnitsLoading] = useState<boolean>(true);
    const [ingredients, setIngredients] = useState<IIngredient[]>(
        [{ category: "", description: "", name: "" }]
    );
    const [isIngredientsLoading, setIsIngredientsLoading] = useState<boolean>(true);
    const [isAddNewIngredientOpen, setIsAddNewIngredientOpen] = useState<boolean>(false);

    // console.log("form data at top of recipe add form", formData);

    const navigate = useNavigate();
    const user = useContext(userContext);

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
        const { id } = evt.currentTarget;
        const [list, key] = id.split("-")
        setFormData(curr => ({
            ...curr,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: curr[list].filter(i => i.key !== key)
        }))
    }

    function addNewIngredientToLocalList(ingredient: IIngredient) {
        setIngredients(curr => [...curr, ingredient]);
    }

    function handleSubmitButtonClick(evt: React.MouseEvent) {
        evt.preventDefault();

        adjustRecipeForSubmit(formData, user?.username || "");

        if (mode === "add") addNewRecipe();
        if (mode === "edit") submitRecipeEdits();

        toggleFormOff();
    }

    async function addNewRecipe() {
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

        navigate(`/recipes/${newRecipe.id}`);
        // return <Navigate to="/" />
    }

    async function submitRecipeEdits() {
        const basicData = {
            description: formData.description,
            mealName: formData.mealName,
            typeName: formData.typeName,
            private: formData.private
        };

        await Promise.allSettled([
            RecipeatsApi.updateRecipeBasics(basicData, recipeId),
            RecipeatsApi.updateRecipeItems({ items: formData.items }, recipeId),
            RecipeatsApi.updateRecipeSteps({ steps: formData.steps }, recipeId),
            RecipeatsApi.updateRecipeNotes(
                {
                    notes: formData.notes,
                    username: user?.username
                },
                recipeId
            )
        ]);

        const updatedRecipe = await RecipeatsApi.getRecipeById(recipeId);

        // @ts-ignore FIXME: how to deal with an optional function?
        updateFullRecipe(updatedRecipe);
    }

    function toggleIsAddingNewIngredientOpen() {
        setIsAddNewIngredientOpen(curr => !curr);
    }

    if (isMealsLoading || isTypesLoading ||
        isUnitsLoading || isIngredientsLoading
    ) {
        return <h1>Loading...</h1>
    }

    // FIXME: input state handling isn't working for checkbox - check BYBO for how we did it there

    return (
        <div>
            <Button onClick={toggleFormOff}>Cancel</Button>
            <Typography variant="h1">{`${_.startCase(mode)} a Recipe`}</Typography>
            <form>
                <Typography variant="h2" mt={3}>Recipe Basics</Typography>
                <Stack gap={2} sx={{ mb: 4 }}>

                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="Recipe Name"
                        variant="standard"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={mode === "edit"}
                    />

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
                                <MenuItem value={m.name} key={m.name}>
                                    {m.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
                                <MenuItem value={t.name} key={t.name}>
                                    {t.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel control={<Checkbox
                        id="private"
                        name="private"
                        checked={formData.private}
                        onChange={handleCheckboxChange}
                    />} label="Private Recipe?" />
                </Stack>
                <Typography variant="h2">Ingredients</Typography>
                <Stack gap={1} sx={{ mb: 4 }}>
                    {formData.items.map((i, idx) => (
                        <Stack direction="row" key={i.key || i.id}>
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
                                        value={units.find(u => u.short === i.unit)}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            size="small"
                                            label="Unit"
                                            variant="standard"
                                        // value={{ label: i.unit?.toString() }}
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
                                        value={ingredients.find(ing => ing.name === i.ingredient)}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            size="small"
                                            label="Ingredient"
                                            variant="standard"
                                        // value={{ label: i.ingredient?.toString() }}
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
                <Typography variant="h2" mt={6}>Steps</Typography>
                <Stack gap={1} sx={{ mb: 4 }}>
                    {formData.steps.map((s, idx) => (
                        <Stack direction="row" key={s.key || s.id}>
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
                <Typography variant="h2" mt={6}>Notes</Typography>
                <Stack gap={1} sx={{ mb: 4 }}>
                    {formData.notes.map((n, idx) => (
                        <Stack direction="row" key={n.key || n.id}>
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
                <div>
                    <Button
                        variant="contained"
                        sx={{ mt: 4 }}
                        onClick={handleSubmitButtonClick}
                    >
                        {mode === "add" && "Submit recipe"}
                        {mode === "edit" && "Save edits"}
                        {mode === "fork" && "Create fork"}
                    </Button>
                </div>
            </form >
            <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                <RecipeAddFormSpeedDial openAddIngredient={toggleIsAddingNewIngredientOpen} />
            </div>
            <AddNewIngredientDialog
                open={isAddNewIngredientOpen}
                toggleOpen={toggleIsAddingNewIngredientOpen}
                addLocalIngredient={addNewIngredientToLocalList}
            />
        </div >
    )
}