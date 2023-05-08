import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

/**
 * UnverifiedUserSpeedDial: Placeholder speed dail component to display if a 
 * user is logged in but is not yet verrified.
 * 
 * Props: N/A
 * 
 * State: N/A
 * 
 * RecipeHome | Recipe | RecipeAddForm -> UnverifiedUserSpeedDial
 */
export default function UnverifiedUserSpeedDial() {
    const actions = [
        {
            icon: <MarkEmailReadIcon />,
            name: 'Verify your e-mail address to view user actions!',
            click: () => { }
        },
    ];

    return (
        <SpeedDial
            ariaLabel="Unverified user speed dial"
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

