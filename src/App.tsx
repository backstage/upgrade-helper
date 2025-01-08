import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import ChangeLogs from './components/pages/ChangeLogs'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/upgrade-helper/changelog/:scope?/:packageName/:version"
          element={<ChangeLogs />}
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
