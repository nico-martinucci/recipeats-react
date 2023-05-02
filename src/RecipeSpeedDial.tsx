import { useContext } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import userContext from "./userContext";

interface Props {
    recipeAuthor: string | undefined;
    toggleEditingOn: () => void;
    toggleAddNoteOpen: () => void;
    toggleUploadPhotoOpen: () => void;
    toggleMode: (mode: "add" | "edit" | "fork") => void;
    toggleRateReviewOpen: () => void;
}

export default function RecipeSpeedDial({
    recipeAuthor,
    toggleEditingOn,
    toggleAddNoteOpen,
    toggleUploadPhotoOpen,
    toggleMode,
    toggleRateReviewOpen
}: Props) {

    const user = useContext(userContext);

    const generalActions = [
        {
            icon: <RestaurantIcon />,
            name: 'Fork Recipe',
            click: () => {
                toggleMode("fork");
                toggleEditingOn();
            }
        },
        {
            icon: <StarRateOutlinedIcon />,
            name: "Rate/Review Recipe (coming soon)",
            click: toggleRateReviewOpen
        }
    ];
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

