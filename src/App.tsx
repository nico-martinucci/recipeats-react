import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Recipe from './Recipe'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RecipesList from './RecipesList'
import RecipesHome from './RecipesHome'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'

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
        <Routes>
          <Route path="/recipes" element={<RecipesHome />} />
          <Route path="/recipes/:recipe_id" element={<Recipe />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
