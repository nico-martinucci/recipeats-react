import { useContext, useState } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import userContext from "./userContext";
import RecipeatsApi from "./api";

interface Props {
    recipeAuthor: string | undefined;
    recipeId: number;
    toggleEditingOn: () => void;
    toggleAddNoteOpen: () => void;
    toggleUploadPhotoOpen: () => void;
    toggleMode: (mode: "add" | "edit" | "fork") => void;
    toggleRateReviewOpen: () => void;
}

export default function RecipeSpeedDial({
    recipeAuthor,
    recipeId,
    toggleEditingOn,
    toggleAddNoteOpen,
    toggleUploadPhotoOpen,
    toggleMode,
    toggleRateReviewOpen
}: Props) {
    const [updateIcons, setUpdateIcons] = useState<boolean>(false);

    const user = useContext(userContext);

    const generalActions = [
        {
            icon: <RestaurantIcon />,
            name: 'Fork Recipe',
            click: () => {
                toggleMode("fork");
                toggleEditingOn();
            }
        }
    ];

    if (user?.favoritedRecipes.has(recipeId)) {
        generalActions.push({
            icon: <StarRateIcon />,
            name: "Unfavorite Recipe",
            click: handleFavoriteClick
        })
    } else {
        generalActions.push({
            icon: <StarRateOutlinedIcon />,
            name: "Favorite Recipe",
            click: handleFavoriteClick
        })
    }

    const userActions = [
        {
            icon: <EditOutlinedIcon />,
            name: 'Edit Recipe',
            click: () => {
                toggleMode("edit");
                toggleEditingOn();
            }
        },
        { icon: <AddAPhotoOutlinedIcon />, name: 'Add Photo', click: toggleUploadPhotoOpen },
        { icon: <PostAddOutlinedIcon />, name: 'Add Note', click: toggleAddNoteOpen },
    ];

    async function handleFavoriteClick() {
        if (!user?.favoritedRecipes.has(recipeId || -1)) {
            let newFavorite = await RecipeatsApi.favoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            console.log("newFavorite api response in RecipeRateReviewDialog", newFavorite);
        } else {
            let deletedFavorite = await RecipeatsApi.unfavoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            console.log("deletedFavorite api response in RecipeRateReviewDialog", deletedFavorite);
        }

        setUpdateIcons(curr => !curr);
    }

    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {generalActions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.click}
                />
            ))}
            {recipeAuthor === user?.username && userActions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.click}
                />
            ))}
        </SpeedDial>
    )
}

