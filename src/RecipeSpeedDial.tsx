import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

export default function RecipeSpeedDial() {
    const actions = [
        { icon: <EditOutlinedIcon />, name: 'Edit Recipe' },
        { icon: <AddAPhotoOutlinedIcon />, name: 'Add Photo' },
        { icon: <PostAddOutlinedIcon />, name: 'Add Note' },
        { icon: <ContentCopyOutlinedIcon />, name: 'Fork Recipe' },
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
                />
            ))}
        </SpeedDial>
    )
}

