import { useState } from "react";
import { IRecipeItem, IRecipeNote, IRecipeStep } from "./Recipe";

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

    // TODO: write server-side routes/queries to get lists of meal types and recipe types
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
                    />
                </div>
                <div className="form-input-block">
                    <label>Recipe Type</label>
                    <select
                        id="typeName"
                        name="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                    >
                        <option value="test">
                            test
                        </option>
                        <option value="test 2">
                            test 2
                        </option>
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