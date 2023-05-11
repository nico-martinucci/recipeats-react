import { useContext, useState } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction, snackbarClasses } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import userContext from "./userContext";
import RecipeatsApi from "./api";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import snackbarContext from "./snackbarContext";

interface Props {
    recipeAuthor: string | undefined;
    recipeId: number;
    toggleEditingOn: () => void;
    toggleAddNoteOpen: () => void;
    toggleUploadPhotoOpen: () => void;
    toggleMode: (mode: "add" | "edit" | "fork") => void;
    toggleRateReviewOpen: () => void;
}

/**
 * RecipeSpeedDial: Speep dial of possible user action for the currently opne
 * recipe.
 * 
 * Props:
 * - recipeAuthor: username of user that created the recipe
 * - recipeId: id of currenly recipe
 * - toggleEditingOn: function to toggle editing mode for the current recipe
 * - toggleAddNoteOpen: function to toggle open the add note dialog
 * - toggleUploadPhotoOpen: function to toggle open the add photo dialog
 * - toggleMode: function to change the current recipe mode (edit, add, or fork)
 * - toggleRateReviewOpen: function to toggle open the rate/review dialog
 * 
 * State: 
 * - updateIcons: state to re-render component for icons that change on user
 *      interaction
 * 
 * Recipe --> RecipeSpeedDial
 */
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
    const snackbar = useContext(snackbarContext);

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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    async function handleFavoriteClick() {
        let message = "";
        if (!user?.favoritedRecipes.has(recipeId || -1)) {
            let newFavorite = await RecipeatsApi.favoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            message = "Recipe favorited!"
        } else {
            let deletedFavorite = await RecipeatsApi.unfavoriteRecipe(
                user?.username,
                recipeId
            );

            user?.updateFavorites(recipeId);

            message = "Recipe unfavorited!"
        }

        snackbar({ message, severity: "info" })

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
                    tooltipOpen={isMobile}
                    tooltipTitle={action.name}
                    onClick={action.click}
                    sx={{ typography: { whiteSpace: 'nowrap' } }}
                />
            ))}
            {recipeAuthor === user?.username && userActions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipOpen={isMobile}
                    tooltipTitle={action.name}
                    onClick={action.click}
                    sx={{ typography: { whiteSpace: 'nowrap' } }}
                />
            ))}
        </SpeedDial>
    )
}

