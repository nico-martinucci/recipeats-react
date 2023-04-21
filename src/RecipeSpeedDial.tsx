import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

interface Props {
    toggleEditingOn: () => void;
}

export default function RecipeSpeedDial({ toggleEditingOn }: Props) {
    const actions = [
        { icon: <EditOutlinedIcon />, name: 'Edit Recipe', click: toggleEditingOn },
        { icon: <AddAPhotoOutlinedIcon />, name: 'Add Photo', click: () => { } },
        { icon: <PostAddOutlinedIcon />, name: 'Add Note', click: () => { } },
        { icon: <ContentCopyOutlinedIcon />, name: 'Fork Recipe', click: () => { } },
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

