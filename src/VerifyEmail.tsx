import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import RecipeatsApi from "./api";

interface Props {
    setLocalStorageToken: (token: string) => void;
}

export default function VerifyEmail({ setLocalStorageToken }: Props) {
    const [isVerifying, setIsVerifying] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(function () {
        async function verifyEmail() {
            let userToken = await RecipeatsApi.verifyUserEmail(searchParams.get("token"));

            if (userToken && "error" in userToken) {
                // TODO: add error handling here
            } else {
                setIsVerifying(false);
                setLocalStorageToken(userToken);
            }
        }

        verifyEmail();
    }, [])

    return (
        <Container>
            {isVerifying &&
                <Typography variant="h1">Verifying...</Typography>
            }
            {!isVerifying &&
                <>
                    <Typography variant="h1">Success!</Typography>
                    <Typography variant="body1">E-mail successfully verified - </Typography>
                    <Typography variant="body1">
                        <Link to="/recipes">
                            click here to get cookin'!
                        </Link>
                    </Typography>
                </>
            }
        </Container>
    )
}