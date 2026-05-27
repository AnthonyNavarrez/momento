import { SignupPage } from './pages/signup'
import { MapPage } from './pages/Map'
import { LoginPage } from './pages/LoginPage'
import { GalleryPage } from './pages/GalleryPage'
import { ExplorePage } from './pages/ExplorePage'
import { PhotoDetailPage } from './pages/PhotoDetailPage'
import { LandingPage } from './pages/LandingPage'
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App
