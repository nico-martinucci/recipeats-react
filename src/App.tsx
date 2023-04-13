import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Recipe from './Recipe'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RecipesList from './RecipesList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/recipes" element={<RecipesList />} />
          <Route path="/recipes/:recipe_id" element={<Recipe />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
