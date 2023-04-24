import { useState } from 'react'
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

function App() {

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <RoutesList />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
