import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';

interface Props {
    openAddIngredient: () => void;
}

export default function RecipeAddFormSpeedDial({ openAddIngredient }: Props) {
    const actions = [
        { icon: <RestaurantOutlinedIcon />, name: 'Add Ingredient', click: openAddIngredient },
    ];
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
                    tooltipTitle={action.name}
                    onClick={action.click}
                />
            ))}
        </SpeedDial>
    )
}

