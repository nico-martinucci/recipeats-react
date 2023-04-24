import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Recipe from './Recipe'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RecipesList from './RecipesList'
import RecipesHome from './RecipesHome'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import RoutesList from './RoutesList'
import Navbar from './Navbar'
import RecipeatsApi from './api'
import jwt_decode from "jwt-decode";
import { ISignupFormData } from './SignupForm'
import userContext from "./userContext";


export interface IUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    isVerified: boolean;
}

function App() {
    const [user, setUser] = useState<IUser>();
    const [token, setToken] = useState<string | null>(localStorage.getItem("recipeatsToken"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: 50,
                fontWeight: 300,
            },
            h2: {
                fontSize: 30,
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

                const { firstName, lastName, email } = (await
                    RecipeatsApi.fetchUserData(username));

                const newUser = { username, firstName, lastName, email, isVerified };
                console.log("email in useEffect in App", email)
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
        }
    }, [token]);


    /** 
     * login function makes api call to "/auth/token" to retrieve token. If call 
     * is successful calls getUserAndJobs. If not successful, return false so that
     * page doesn't redirect.
     */
    // async function login(data) {
    //   const newToken = await RecipeatsApi.loginUser(data);
    //   setToken(newToken);
    // }

    /** 
     * signup function makes api call to "/auth/register" to retrieve token. If 
     * call is successful calls getUserAndJobs. If not successful, return false 
     * so that page doesn't redirect. 
     */
    async function signup(data: ISignupFormData) {
        console.log("signup data", data);
        const newToken = await RecipeatsApi.signupUser(data);
        console.log("token", newToken);
        setToken(newToken);
    }

    function setLocalStorageToken(token: string) {
        localStorage.setItem("recipeatsToken", token);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <userContext.Provider value={user}>
                <BrowserRouter>
                    <Navbar />
                    <RoutesList signup={signup} setLocalStorageToken={setLocalStorageToken} />
                </BrowserRouter>
            </userContext.Provider>
        </ThemeProvider >
    )
}

export default App
