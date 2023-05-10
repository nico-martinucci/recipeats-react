import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

interface Props {
    openAddIngredient: () => void;
    openAddSubsection: () => void;
}

/**
 * RecipeAddFormSpeedDial: Speed dial of possible user actions for the recipe
 * add form.
 * 
 * Props:
 * - openAddIngredient: function to open the add ingredient dialog.
 * 
 * State: N/A
 * 
 * RecipeAddForm --> RecipeAddFormSpeedDial
 */
export default function RecipeAddFormSpeedDial({ openAddIngredient, openAddSubsection }: Props) {
    const actions = [
        {
            icon: <RestaurantOutlinedIcon />,
            name: 'Add Ingredient',
            click: openAddIngredient
        },
        {
            icon: <PlaylistAddIcon />,
            name: 'Add Subsection',
            click: openAddSubsection
        }
    ];

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

