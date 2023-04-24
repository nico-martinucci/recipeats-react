import { Container, Typography } from "@mui/material";

interface Props {
    email: string;
}

export default function EmailVerificationPending({ email }: Props) {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>
                Verify Your Email
            </Typography>
            <Typography variant="body1">
                {`A verification e-mail has been sent to ${email} - please click
            the link in the message to verify your e-mail address.`}
            </Typography>
        </Container>
    )
}