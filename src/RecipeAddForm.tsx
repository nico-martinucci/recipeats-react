import { useEffect, useState } from "react";
import { IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";
import RecipeatsApi from "./api";
import "./RecipeAddForm.css"

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

interface IMeals {
    name: string,
    description: string
}

interface ITypes {
    name: string,
    description: string
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
    const [meals, setMeals] = useState<IMeals[]>();
    const [isMealsLoading, setIsMealsLoading] = useState<Boolean>(true);
    const [types, setTypes] = useState<ITypes[]>();
    const [isTypesLoading, setIsTypesLoading] = useState<Boolean>(true);

    useEffect(function () {
        async function getMealsAndTypes() {
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
        }

        getMealsAndTypes();
    }, [])

    console.log("meals", meals);
    console.log("types", types);

    function handleChange(
        evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement
            | HTMLSelectElement>
    ) {
        const { name, value } = evt.target;
        setFormData((fData) => ({
            ...fData,
            [name]: value,
        }));
    }

    if (isMealsLoading || isTypesLoading) return <h1>Loading...</h1>

    // FIXME: input state handling isn't working for checkbox - check BYBO for how we did it there

    return (
        <div className="RecipeAddForm">
            <h1>Add/Edit a Recipe</h1>
            <form>
                <h2>Recipe Basics</h2>
                <div className="RecipeAddForm-inputBlock">
                    <label className="RecipeAddForm-inputLabel">Recipe Name</label>
                    <input
                        className="RecipeAddForm-input"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="RecipeAddForm-inputBlock">
                    <label className="RecipeAddForm-inputLabel">Description</label>
                    <textarea
                        className="RecipeAddForm-input"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="RecipeAddForm-inputBlock">
                    <label className="RecipeAddForm-inputLabel">Meal</label>
                    <select
                        className="RecipeAddForm-input"
                        id="mealName"
                        name="mealName"
                        value={formData.mealName}
                        onChange={handleChange}
                    >
                        {meals?.map(m => (
                            <option value={m.name}>
                                {m.name} - {m.description}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="RecipeAddForm-inputBlock">
                    <label className="RecipeAddForm-inputLabel">Recipe Type</label>
                    <select
                        className="RecipeAddForm-input"
                        id="typeName"
                        name="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                    >
                        {types?.map(t => (
                            <option value={t.name}>
                                {t.name} - {t.description}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="RecipeAddForm-inputBlock">
                    <label className="RecipeAddForm-inputLabel">Private Recipe?</label>
                    <input
                        className="RecipeAddForm-input"
                        id="private"
                        name="private"
                        type="checkbox"
                        checked={formData.private}
                        onChange={handleChange}
                    />
                </div>
                <h2>Ingredients</h2>
                <div style={{ display: "table" }}>
                    <div style={{ display: "table-cell" }}><input placeholder="amount" /></div>
                    <div style={{ display: "table-cell" }}><select placeholder="unit"></select></div>
                    <div style={{ display: "table-cell" }}><input placeholder="ingredient" /></div>
                    <div style={{ display: "table-cell" }}><input placeholder="description" /></div>
                </div>
                <h2>Steps</h2>
                <h2>Notes</h2>
            </form>
        </div>
    )
}