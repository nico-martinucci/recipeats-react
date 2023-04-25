import { useContext } from "react";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import userContext from "./userContext";

interface Props {
    recipeAuthor: string | undefined;
    toggleEditingOn: () => void;
}

export default function RecipeSpeedDial({ recipeAuthor, toggleEditingOn }: Props) {

    const user = useContext(userContext);

    const generalActions = [
        { icon: <ContentCopyOutlinedIcon />, name: 'Fork Recipe', click: () => { } },
    ];
    const userActions = [
        { icon: <EditOutlinedIcon />, name: 'Edit Recipe', click: toggleEditingOn },
        { icon: <AddAPhotoOutlinedIcon />, name: 'Add Photo', click: () => { } },
        { icon: <PostAddOutlinedIcon />, name: 'Add Note', click: () => { } },
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

