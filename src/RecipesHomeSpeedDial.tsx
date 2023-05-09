import { useContext } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

interface Props {
    showAddRecipeForm: () => void;
    toggleIsShowingFavorites: () => void;
    isShowingFavorites: boolean;
}

/**
 * RecipesHomeSpeedDial: Speed dial of possible user actions for the recipe home
 * page (which defaults to the list of all recipes and search bar).
 * 
 * Props:
 * - showAddRecipeForm: function to toggle showing the recipe add form
 * - toggleIsShowingFavorites: function to toggle whether favorites are showing
 *      or not
 * - isShowingFavorites: whether favorites are being showed or not
 * 
 * State: N/A
 * 
 * RecipesHome --> RecipesHomeSpeedDial
 */
export default function RecipesHomeSpeedDial({
    showAddRecipeForm,
    toggleIsShowingFavorites,
    isShowingFavorites
}: Props) {
    const actions = [
        { icon: <PostAddOutlinedIcon />, name: 'Add a Recipe', click: showAddRecipeForm },
    ];

    if (isShowingFavorites) {
        actions.push({
            icon: <StarRateIcon />,
            name: 'Show All',
            click: toggleIsShowingFavorites
        })
    } else {
        actions.push({
            icon: <StarRateOutlinedIcon />,
            name: 'Show Favorites',
            click: toggleIsShowingFavorites
        })
    }

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
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

