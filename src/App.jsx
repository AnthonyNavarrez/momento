import { SignupPage } from './pages/signup'
import { MapPage } from './pages/Map'
import { LoginPage } from './pages/LoginPage'
import { GalleryPage } from './pages/GalleryPage'
import { ExplorePage } from './pages/ExplorePage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NavBar } from './components/Navbar'

function App() {

  return (
    <BrowserRouter>
        <AuthProvider>
            <NavBar/>
          <Routes>
            <Route path="/" element={<Navigate to="/map" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App
