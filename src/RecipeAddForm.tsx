import { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { IRecipe, IRecipeItem, IRecipeNote, IRecipeStep, ISubsection } from "./Recipe";
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
import LoadingSpinner from "./LoadingSpinner";
import ManageSubsectionsDialog from "./ManageSubsectionsDialog";
import snackbarContext from "./snackbarContext";

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
    description?: string;
    name: string;
}

interface Props {
    data?: IRecipeEntryData;
    toggleFormOff: () => void;
    toggleMode?: (mode: "add" | "edit" | "fork") => void;
    mode: ("add" | "edit" | "fork");
    recipeId: number | undefined;
    updateFullRecipe?: ((recipe: IRecipe) => void);
    subsections: ISubsection[];
    updateSubsections: (newSubsections: ISubsection[]) => void;
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

/**
 * RecipeAddForm: Form for adding, editing, and forking recipes.
 * 
 * Props:
 * - data: initial data to populate form with
 * - toggleFormOff: parent function to exit out of form, back to recipe
 * - mode: whether the form is in "add", "edit", or "fork" mode
 * - recipeId: recipeId for current recipe (0 if new recipe)
 * - updateFullRecipe: function to update all recipe data with the provided
 *      recipe data
 * 
 * State: 
 * - formData: controlled form component value tracking
 * - meals: list of possible meal options
 * - isMealsLoading: whether or not meals list has loaded yet
 * - types: list of possible recipe types
 * - isTypesLoading: whether or not types list has loaded yet
 * - units: list of possible units
 * - isUnitsLoading: whether or not units list has loaded yet
 * - ingredients: list of possible ingredient choices
 * - isIngredientsLoading: whether or not ingredients list has loaded yet
 * - isAddNewIngredientOpen: boolean controlling open state of add ingredient
 *      dialog
 * - isManageSubsectionsOpen: boolean controlling open state of manage
 *      subsections dialog
 * 
 * RecipesHome | Recipe -> RecipeAddForm -> RecipeAddFormSpeedDial, (AddNewIngredientDialog)
 */
export default function RecipeAddForm({
    data = initialData,
    toggleFormOff,
    toggleMode,
    mode,
    recipeId = 0,
    updateFullRecipe,
    subsections,
    updateSubsections
}: Props) {
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
    const [isManageSubsectionsOpen, setIsManageSubsectionsOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const user = useContext(userContext);
    const changeAndOpenSnackbar = useContext(snackbarContext);

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
        evt: (SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    ) {
        console.log(evt)
        const { value, name } = evt.target;
        const [list, data, idx] = name.split("-");

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
                    key: _.uniqueId("RecipeAddForm"),
                    subsection: null
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
                    key: _.uniqueId("RecipeAddForm"),
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
                    key: _.uniqueId("RecipeAddForm"),
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
            [list]: curr[list].filter(i => {
                if (i.id) {
                    return i.id.toString() !== key
                } else {
                    return i.key !== key
                }
            })
        }))
    }

    function addNewIngredientToLocalList(ingredient: IIngredient) {
        setIngredients(curr => [...curr, ingredient]);
    }

    function removeDeletedSubsectionsFromItems(newSubsections: ISubsection[]) {
        console.log("current subsections", newSubsections);

        const subsectionNames = new Set(newSubsections.map(s => s.subsection));
        setFormData(curr => ({
            ...curr,
            items: curr.items.map(i => {
                if (i.subsection && subsectionNames.has(i.subsection)) return i;

                return {
                    ...i,
                    subsection: ""
                }
            })
        }))
    }

    function handleSubmitButtonClick() {
        event?.preventDefault();

        adjustRecipeForSubmit(formData, user?.username || "");

        if (mode === "add" || mode === "fork") addNewRecipe();
        if (mode === "edit") submitRecipeEdits();

        changeAndOpenSnackbar({
            message: `Recipe ${mode}ed!`,
            severity: "success"
        })

        toggleFormOff();
    }

    async function addNewRecipe() {
        let newRecipe;

        if (mode === "fork") {
            newRecipe = await RecipeatsApi.addNewRecipe({ ...formData, forkedFrom: recipeId });
        } else {
            newRecipe = await RecipeatsApi.addNewRecipe(formData);
        }

        let notePromises = [];

        for (let note of formData.notes) {
            notePromises.push(RecipeatsApi.addNoteToRecipe(
                {
                    ...note,
                    username: user?.username
                },
                newRecipe.id
            ))
        }

        await Promise.allSettled(notePromises);

        const newRecipeData = await RecipeatsApi.getRecipeById(newRecipe.id)

        if (mode === "fork") {
            // @ts-ignore FIXME: how to deal with an optional function?
            updateFullRecipe(newRecipeData);
        } else {
            navigate(`/recipes/${newRecipe.id}`);
        }

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

    function toggleIsManageSubsectionsOpen() {
        setIsManageSubsectionsOpen(curr => !curr);
    }

    if (isMealsLoading || isTypesLoading ||
        isUnitsLoading || isIngredientsLoading
    ) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <Button onClick={toggleFormOff}>Cancel</Button>
            <Typography variant="h1">{`${_.startCase(mode)} Recipe`}</Typography>
            <form onSubmit={handleSubmitButtonClick}>
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
                        required
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
                        required
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
                            required
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
                            required
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
                                        name={`items-amount-${idx}`}
                                        value={i.amount}
                                        onChange={handleNestedChange}
                                        size="small"
                                        inputProps={{
                                            type: 'number',
                                            pattern: '[0-9]*' // allows only digits
                                        }}
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
                                <Grid2 xs={12} sm={subsections.length ? 3 : 4}>
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
                                            required
                                        // value={{ label: i.ingredient?.toString() }}
                                        />}
                                    />
                                </Grid2>
                                <Grid2 xs={12} sm={subsections.length ? 3 : 4}>
                                    <TextField
                                        label="Description"
                                        variant="standard"
                                        fullWidth
                                        id={`items-description-${idx}`}
                                        name={`items-description-${idx}`}
                                        value={i.description?.toString()}
                                        onChange={handleNestedChange}
                                        size="small"
                                    />
                                </Grid2>
                                {subsections.length > 0 &&
                                    <Grid2 xs={12} sm={2}>
                                        <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                            <InputLabel id="type-select-label">Subsection</InputLabel>
                                            <Select
                                                labelId="subsection-select-label"
                                                fullWidth
                                                name={`items-subsection-${idx}`}
                                                defaultValue=""
                                                value={i.subsection?.toString()}
                                                onChange={handleNestedChange}
                                                size="small"
                                                required
                                            >
                                                {subsections?.map(s => (
                                                    <MenuItem
                                                        value={s.subsection}
                                                        key={s.subsection}
                                                    >
                                                        {s.subsection}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid2>
                                }
                            </Grid2>
                            <IconButton
                                id={`items-${i.id ?? i.key}`}
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
                                name={`steps-description-${idx}`}
                                value={s.description}
                                onChange={handleNestedChange}
                                required
                            />
                            <IconButton
                                id={`steps-${s.id ?? s.key}`}
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
                                name={`notes-note-${idx}`}
                                value={n.note}
                                onChange={handleNestedChange}
                                required
                            />
                            <IconButton
                                id={`notes-${n.id ?? n.key}`}
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
                        type="submit"
                    >
                        {mode === "add" && "Submit recipe"}
                        {mode === "edit" && "Save edits"}
                        {mode === "fork" && "Create fork"}
                    </Button>
                </div>
            </form >
            <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                <RecipeAddFormSpeedDial
                    openAddIngredient={toggleIsAddingNewIngredientOpen}
                    openAddSubsection={toggleIsManageSubsectionsOpen}
                />
            </div>
            <AddNewIngredientDialog
                open={isAddNewIngredientOpen}
                toggleClose={toggleIsAddingNewIngredientOpen}
                addLocalIngredient={addNewIngredientToLocalList}
            />
            <ManageSubsectionsDialog
                open={isManageSubsectionsOpen}
                toggleClose={toggleIsManageSubsectionsOpen}
                subsections={subsections}
                updateSubsections={updateSubsections}
                removeDeletedSubsectionsFromItems={removeDeletedSubsectionsFromItems}
            />
        </div >
    )
}