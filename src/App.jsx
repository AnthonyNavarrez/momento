import { SignupPage } from './pages/signup'
import { MapPage } from './pages/Map'
import { LoginPage } from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from './components/Navbar'

function App() {

  return (
    <BrowserRouter>
        <AuthProvider>
            <NavBar/>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App
