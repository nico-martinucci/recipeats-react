import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import RoutesList from './RoutesList'
import Navbar from './Navbar'
import userContext from "./userContext";
import snackbarContext from './snackbarContext';
import RecipeatsApi from './api'
import { ISignupFormData } from './SignupForm'
import { ILoginFormData } from './LoginForm'
import LoadingSpinner from './LoadingSpinner';
import GlobalSnackbar from './GlobalSnackbar';


export interface IUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    isVerified: boolean;
    favoritedRecipes: Set<number>;
    updateFavorites: (recipeId: number) => void;
}

export interface ISnackbarContent {
    severity: "error" | "warning" | "info" | "success";
    message: string;
}

function App() {
    const [user, setUser] = useState<IUser>();
    const [token, setToken] = useState<string>(localStorage.getItem("recipeatsToken") || "");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [snackbarContent, setSnackbardContent] = useState<ISnackbarContent>();

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: 50,
                fontWeight: 300,
            },
            h2: {
                fontSize: 30,
            },
            h3: {
                fontSize: 20,
                fontWeight: 500
            }
        },
    });

    /**
     * effect triggered on change of token state. Checks localStorage for token. 
     * If token exists then setToken, triggering other useEffect
     */
    useEffect(function getUserData() {
        async function fetchUserDataFromApi() {

            RecipeatsApi.token = token;
            // @ts-ignore FIXME:
            const { username, isVerified } = jwt_decode(token);

            try {

                const { firstName, lastName, email, favoritedRecipes } = (await
                    RecipeatsApi.fetchUserData(username));

                const favoritedRecipesLookup: Set<number> = new Set(favoritedRecipes);

                const newUser = {
                    username, firstName, lastName, email, isVerified,
                    favoritedRecipes: favoritedRecipesLookup,
                    updateFavorites(this: IUser, recipeId: number) {
                        if (this.favoritedRecipes.has(recipeId)) {
                            this.favoritedRecipes.delete(recipeId);
                        } else {
                            this.favoritedRecipes.add(recipeId);
                        }
                    }
                };

                setUser(newUser);
            } catch (err) {

                // setToast({ open: true, msg: err[0] });
            } finally {
                setIsLoading(false);
            }
        }
        if (token) {
            fetchUserDataFromApi();
            setLocalStorageToken(token);
        }
        else {
            setIsLoading(false);
            setUser(undefined);
        }
    }, [token]);


    /** 
     * login function makes api call to "/auth/token" to retrieve token. If call 
     * is successful calls getUserAndJobs. If not successful, return false so that
     * page doesn't redirect.
     */
    async function login(data: ILoginFormData) {
        const newToken = await RecipeatsApi.loginUser(data);

        setToken(newToken);
    }

    /** 
     * signup function makes api call to "/auth/register" to retrieve token. If 
     * call is successful calls getUserAndJobs. If not successful, return false 
     * so that page doesn't redirect. 
     */
    async function signup(data: ISignupFormData) {
        const newToken = await RecipeatsApi.signupUser(data);

        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("recipeatsToken");
        setToken("");
    }

    function setLocalStorageToken(token: string) {
        localStorage.setItem("recipeatsToken", token);
    }

    function toggleSnackbarOpen(isOpen: boolean) {
        setIsSnackbarOpen(isOpen);
    }

    function changeAndOpenSnackbar(content: ISnackbarContent) {
        setSnackbardContent(content);
        toggleSnackbarOpen(true);
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <userContext.Provider value={user}>
                <snackbarContext.Provider value={changeAndOpenSnackbar}>
                    <BrowserRouter>
                        <Navbar logout={logout} />
                        <RoutesList signup={signup} login={login} setLocalStorageToken={setLocalStorageToken} />
                        <GlobalSnackbar
                            open={isSnackbarOpen}
                            toggleSnackbarOpen={toggleSnackbarOpen}
                            content={snackbarContent}
                        />
                    </BrowserRouter>
                </snackbarContext.Provider>
            </userContext.Provider>
        </ThemeProvider >
    )
}

export default App
