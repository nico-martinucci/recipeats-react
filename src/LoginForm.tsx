import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Stack } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Props {
    login: (data: ILoginFormData) => void;
}

export interface ILoginFormData {
    username: string;
    password: string;
}

const initialData = {
    username: "",
    password: ""
}

export default function LoginForm({ login }: Props) {
    const [formData, setFormData] = useState<ILoginFormData>(initialData);

    const navigate = useNavigate();

    function handleChange(
        evt: (SelectChangeEvent | React.ChangeEvent<HTMLInputElement |
            HTMLTextAreaElement>)
    ) {
        const { name, value } = evt.target;

        setFormData((curr) => ({
            ...curr,
            [name]: value,
        }));
    }

    function handleLogin() {
        login(formData);
        navigate("/");
    }

    return (
        <Container>
            <Typography variant="h1">Log In</Typography>
            <form>
                <TextField
                    sx={{ minWidth: "100%" }}
                    label="Username"
                    variant="standard"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    sx={{ minWidth: "100%" }}
                    label="Password"
                    variant="standard"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <Stack direction="row" gap={2} my={2}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained" onClick={handleLogin}>Submit</Button>
                </Stack>
            </form>

        </Container>
    );
}