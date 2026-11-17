import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<CategoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
