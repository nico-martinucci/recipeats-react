import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { Button, Container, Stack, TextField, Typography } from "@mui/material"
import { SelectChangeEvent } from "@mui/material";

import userContext from "./userContext";
import EmailVerificationPending from "./EmailVerificationPending";


interface Props {
    signup: (data: ISignupFormData) => void;
}

export interface ISignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    bio: string;
}

const initialData = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: ""
}

export default function SignupForm({ signup }: Props) {
    const [formData, setFormData] = useState<ISignupFormData>(initialData);

    const user = useContext(userContext);

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

    function handleSignup() {
        signup(formData);
    }

    return (
        <Container>
            {!user &&
                <form onSubmit={handleSignup}>
                    <Typography variant="h1">Sign Up</Typography>
                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="First Name"
                        variant="standard"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="Last Name"
                        variant="standard"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="E-mail"
                        variant="standard"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="Username"
                        variant="standard"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
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
                        required
                    />
                    <TextField
                        sx={{ minWidth: "100%" }}
                        label="Confirm Password"
                        variant="standard"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <Stack direction="row" gap={2} my={2}>
                        <Button variant="outlined">Cancel</Button>
                        <Button variant="contained" type="submit">Submit</Button>
                    </Stack>
                </form>
            }
            {user && user.isVerified === false &&
                <EmailVerificationPending email={user.email} />
            }
        </Container>
    )
}