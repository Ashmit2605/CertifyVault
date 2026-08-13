import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashLayout from './Pages/AdminDashLayout/AdminDashLayout'

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashLayout />} />
      
    </Routes>
  )
}

export default App