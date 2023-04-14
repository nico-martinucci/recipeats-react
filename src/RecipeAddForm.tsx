import { useEffect, useState } from "react";
import { IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";
import RecipeatsApi from "./api";

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

    // FIXME: input state handling isn't working - check BYBO for how we did it there

    return (
        <div className="RecipeAddForm">
            <h1>Add/Edit a Recipe</h1>
            <form>
                <h2>Recipe Basics</h2>
                <div className="form-input-block">
                    <label>Recipe Name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-block">
                    <label>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-block">
                    <label>Meal</label>
                    <select
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
                <div className="form-input-block">
                    <label>Recipe Type</label>
                    <select
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
                <div className="form-input-block">
                    <label>Private Recipe?</label>
                    <input
                        id="private"
                        name="private"
                        type="checkbox"
                        checked={formData.private}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </div>
    )
}