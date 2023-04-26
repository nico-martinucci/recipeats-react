import { useContext } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';

interface Props {
    showAddRecipeForm: () => void;
}

export default function RecipesHomeSpeedDial({ showAddRecipeForm }: Props) {
    const actions = [
        { icon: <PostAddOutlinedIcon />, name: 'Add a Recipe', click: showAddRecipeForm },
        { icon: <StarRateOutlinedIcon />, name: 'Show Favorites', click: () => { } },
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

