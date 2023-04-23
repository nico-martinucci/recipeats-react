import { useParams } from "react-router-dom";
import RecipeItem from "./RecipeItem";
import RecipeStep from "./RecipeStep";
import RecipeNote from "./RecipeNote";
import RecipeatsApi from "./api";
import { useState, useEffect } from "react";
import {
    Card, CardActions, CardContent, CardMedia, Button, Typography, Container
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import RecipeSpeedDial from "./RecipeSpeedDial";
import RecipeAddForm from "./RecipeAddForm";

export interface IRecipeItem {
    amount: string | number | null;
    description: string;
    id: number | null;
    ingredient: string;
    order: number | null;
    unit: string | null;
    key: string;
}

export interface IRecipeStep {
    description: string | null;
    id: number | null;
    order: number | null;
    key: string;
}

export interface IRecipeNote {
    id: number | null;
    note: string | null;
    username?: string | null;
    key: string;
}

export interface IRecipe {
    name: string;
    description: string;
    createdBy?: string;
    id?: number;
    mealName: string;
    typeName: string;
    items: IRecipeItem[];
    steps: IRecipeStep[];
    notes: IRecipeNote[];
    private: boolean;
}

export default function Recipe() {
    const [recipe, setRecipe] = useState<IRecipe>();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [isEditing, setIsEditing] = useState<Boolean>(false);

    const { recipe_id } = useParams();

    useEffect(function () {
        async function getRecipe() {
            let recipe = await RecipeatsApi.getRecipeById(Number(recipe_id));
            setRecipe(recipe);
            setIsLoading(false);
        }

        getRecipe();
    }, [])

    function toggleEditingOn() {
        setIsEditing(true);
    }

    function toggleEditingOff() {
        setIsEditing(false);
    }

    if (isLoading) return <h1>Loading...</h1>

    return (
        <>
            {!isEditing &&
                <Container>
                    <Card>
                        <CardMedia
                            sx={{ height: 300 }}
                            image="https://hips.hearstapps.com/del.h-cdn.co/assets/18/11/2048x1152/hd-aspect-1520956952-chicken-tacos-horizontal.jpg?resize=1200:*"
                            title="recipe image"
                        />
                        <CardContent>
                            <Grid2 container spacing={2} xs>
                                <Grid2 xs={12}>
                                    <Typography variant="h1">{recipe?.name}</Typography>
                                    <Typography variant="subtitle1">{recipe?.description}</Typography>
                                </Grid2>
                                <Grid2 xs={12} md={6}>
                                    <Typography variant="h2">Ingredients</Typography>
                                    <ul>
                                        {recipe?.items.map(i => (
                                            <RecipeItem key={i.order} item={i} />
                                        ))}
                                    </ul>
                                </Grid2>
                                <Grid2 xs={12} md={6}>
                                    <Typography variant="h2">Steps</Typography>
                                    <ol>
                                        {recipe?.steps.map(s => (
                                            <RecipeStep key={s.order} step={s} />
                                        ))}
                                    </ol>
                                    <Typography variant="h2">Notes</Typography>
                                    <ul>
                                        {recipe?.notes.map(n => (
                                            <RecipeNote key={n.id} note={n} />
                                        ))}
                                    </ul>
                                </Grid2>
                            </Grid2>

                        </CardContent>
                        <CardActions>

                        </CardActions>
                    </Card>
                    <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                        <RecipeSpeedDial toggleEditingOn={toggleEditingOn} />
                    </div>
                </Container>
            }
            {isEditing &&
                <Container>
                    <RecipeAddForm data={recipe} toggleFormOff={toggleEditingOff} mode="edit" />
                </Container>
            }
        </>
    )
}