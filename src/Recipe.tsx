import { useParams } from "react-router-dom";
import RecipeItem from "./RecipeItem";
import RecipeStep from "./RecipeStep";
import RecipeNote from "./RecipeNote";
import RecipeatsApi from "./api";
import { useState, useEffect, useContext } from "react";
import {
    Card, CardActions, CardContent, CardMedia, Button, Typography, Container
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import RecipeSpeedDial from "./RecipeSpeedDial";
import RecipeAddForm from "./RecipeAddForm";
import AddNewNoteDialog from "./AddNewNoteDialog";
import userContext from "./userContext";
import UploadRecipePhotoDialog from "./UploadRecipePhotoDialog";
import RecipeRateReviewDialog from "./RecipeRateReviewDialog";

export interface IRecipeBasics {
    name?: string;
    description: string;
    createdBy?: string;
    id?: string;
    mealName: string;
    typeName: string;
    private: boolean;
}

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
    photoUrl?: string;
    forkedFrom?: number;
}

export default function Recipe() {
    const [recipe, setRecipe] = useState<IRecipe>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [mode, setMode] = useState<"add" | "edit" | "fork">("edit");
    const [isAddNewNoteOpen, setIsAddNewNoteOpen] = useState<boolean>(false);
    const [isUploadNewPhotoOpen, setIsUploadNewPhotoOpen] = useState<boolean>(false);
    const [isRateReviewOpen, setIsRateReviewOpen] = useState<boolean>(false);

    const user = useContext(userContext);
    const { recipeId } = useParams();

    useEffect(function () {
        async function getRecipe() {
            let recipe = await RecipeatsApi.getRecipeById(Number(recipeId));
            setRecipe(recipe);
            setIsLoading(false);
        }

        getRecipe();
    }, [])

    function toggleEditing() {
        setIsEditing(curr => !curr);
    }

    function toggleMode(mode: "add" | "edit" | "fork") {
        setMode(mode);
    }

    function toggleIsAddingNewNoteOpen() {
        setIsAddNewNoteOpen(curr => !curr);
    }

    function addNewNoteToLocalList(note: IRecipeNote) {
        setRecipe((curr) => ({
            ...curr,
            notes: [...curr?.notes || [], note],
        }) as IRecipe)
    }

    function toggleIsUploadingNewPhotoOpen() {
        setIsUploadNewPhotoOpen(curr => !curr);
    }

    function updateRecipeCoverPhoto(photoUrl: string) {
        setRecipe(curr => ({
            ...curr,
            photoUrl: photoUrl
        }) as IRecipe)
    }

    function toggleIsRateReviewOpen() {
        setIsRateReviewOpen(curr => !curr);
    }

    function updateFullRecipe(newRecipe: IRecipe) {
        setRecipe(newRecipe);
    }

    if (isLoading) return <h1>Loading...</h1>

    return (
        <>
            {!isEditing &&
                <>
                    <Container>
                        <Card>
                            {recipe?.photoUrl && <CardMedia
                                sx={{ height: 300 }}
                                image={recipe?.photoUrl}
                                title="recipe image"
                            />}
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
                        {user && <div style={{ position: "fixed", bottom: 0, right: 0 }}>
                            <RecipeSpeedDial
                                recipeAuthor={recipe?.createdBy}
                                toggleEditingOn={toggleEditing}
                                toggleAddNoteOpen={toggleIsAddingNewNoteOpen}
                                toggleUploadPhotoOpen={toggleIsUploadingNewPhotoOpen}
                                toggleMode={toggleMode}
                                toggleRateReviewOpen={toggleIsRateReviewOpen}
                            />
                        </div>}
                    </Container>
                    <AddNewNoteDialog
                        recipeId={recipe?.id}
                        open={isAddNewNoteOpen}
                        toggleClose={toggleIsAddingNewNoteOpen}
                        addLocalNote={addNewNoteToLocalList}
                    />
                    <UploadRecipePhotoDialog
                        recipeId={recipe?.id || -1}
                        open={isUploadNewPhotoOpen}
                        toggleClose={toggleIsUploadingNewPhotoOpen}
                        updatePhoto={updateRecipeCoverPhoto}
                    />
                    <RecipeRateReviewDialog
                        open={isRateReviewOpen}
                        toggleClose={toggleIsRateReviewOpen}
                        initialData={{ isStarred: false }}
                    />
                </>
            }
            {isEditing &&
                <Container>
                    <RecipeAddForm
                        data={recipe}
                        toggleFormOff={toggleEditing}
                        toggleMode={toggleMode}
                        mode={mode}
                        recipeId={recipe?.id}
                        updateFullRecipe={updateFullRecipe}
                    />
                </Container>
            }
        </>
    )
}