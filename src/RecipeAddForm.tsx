import { useEffect, useState } from "react";
import { IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";
import RecipeatsApi from "./api";
import "./RecipeAddForm.css"
import _ from "lodash"
import {
    TextField, FormControl, InputLabel, Select, MenuItem, Menu, FormGroup,
    FormControlLabel, Checkbox, Autocomplete
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material"

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
    name: "",
    description: "",
    mealName: "",
    typeName: "",
    private: false,
    items: [],
    steps: [],
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
        console.log("event target", evt.target);
        const { name, value } = evt.target;
        setFormData((fData) => ({
            ...fData,
            [name]: value,
        }));
    }

    function handleAutocompleteChange(evt, value) {

        const [list, data, idx, propName] = evt.target.id.split("-");

        setFormData((fData) => {

            console.log("fData inside setter", fData);
            return {
                ...fData,
                // @ts-ignore FIXME: this works but throws a weird error...
                [list]: fData[list].map((
                    x: (IRecipeItem | IRecipeStep | IRecipeNote),
                    i: number
                ) => {
                    if (i !== +idx) return x
                    return {
                        ...x,
                        [data]: value ? value[propName] : ""
                    }
                })
            }
        }
        )
    }

    function handleNestedChange(evt) {

        const { value, id } = evt.target;
        const [list, data, idx] = id.split("-");

        setFormData((fData) => ({
            ...fData,
            // @ts-ignore FIXME: this works but throws a weird error...
            [list]: fData[list].map((
                x: (IRecipeItem | IRecipeStep | IRecipeNote),
                i: number
            ) => {
                if (i !== +idx) return x
                return {
                    ...x,
                    [data]: data === "amount" ? +value : value
                }
            })
        }))
    }

    console.log("form data (after update)", formData);

    function onAddIngredientClick(evt: React.MouseEvent) {
        evt.preventDefault();
        setFormData(curr => ({
            ...curr,
            items: [
                ...curr.items,
                {
                    amount: 0,
                    description: "",
                    id: null,
                    ingredient: "",
                    order: null,
                    unit: ""
                }
            ]
        }))
    }

    if (isMealsLoading || isTypesLoading || isUnitsLoading) {
        return <h1>Loading...</h1>
    }

    const testOptions = [
        { id: 1, name: "test 1" },
        { id: 2, name: "test 2" },
        { id: 3, name: "test 3" },
    ]

    // FIXME: input state handling isn't working for checkbox - check BYBO for how we did it there

    return (
        <div>
            <h1>Add/Edit a Recipe</h1>
            <form>
                <h2>Recipe Basics</h2>
                <div>
                    <TextField
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
                    <FormControl variant="standard" sx={{ minWidth: 200 }}>
                        <InputLabel id="meal-select-label">Meal</InputLabel>
                        <Select
                            labelId="meal-select-label"
                            id="mealName"
                            name="mealName"
                            defaultValue=""
                            value={formData.mealName}
                            onChange={handleChange}
                        >
                            <MenuItem></MenuItem>
                            {meals?.map(m => (
                                <MenuItem value={m.name} key={_.uniqueId()}>
                                    {m.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl variant="standard" sx={{ minWidth: 200 }}>
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
                        onChange={handleChange}
                    />} label="Private Recipe?" />
                </div>
                <h2>Ingredients</h2>
                {formData.items.map((i, idx) => (
                    <div key={idx}>
                        <div>
                            <TextField
                                label="Amount"
                                variant="standard"
                                id={`items-amount-${idx}`}
                                placeholder="amount"
                                value={i.amount?.toString()}
                                onChange={handleNestedChange}
                            />
                        </div>
                        <div>
                            <Autocomplete
                                disablePortal
                                autoComplete
                                autoHighlight
                                autoSelect
                                disableClearable
                                sx={{ width: 300 }}
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
                        </div>
                        <div>
                            <Autocomplete
                                disablePortal
                                autoComplete
                                autoHighlight
                                autoSelect
                                disableClearable
                                sx={{ width: 300 }}
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
                        </div>
                        <div>
                            <TextField
                                label="Description"
                                variant="standard"
                                id={`items-description-${idx}`}
                                placeholder="description"
                                value={i.description?.toString()}
                                onChange={handleNestedChange}
                            />
                        </div>
                    </div>
                ))}
                <button onClick={onAddIngredientClick}>Add ingredient</button>
                <h2>Steps</h2>
                {formData.steps.map((s, idx) => (
                    <textarea>
                        { }
                    </textarea>
                ))}
                <h2>Notes</h2>
            </form>
        </div>
    )
}