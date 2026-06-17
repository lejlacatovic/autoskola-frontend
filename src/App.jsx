import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Kalendar from './pages/Kalendar';
import Vozila from './pages/Vozila';
import Profil from './pages/Profil';
import InstruktorDashboard from './pages/InstruktorDashboard';
import ZakaziCas from './pages/ZakaziCas';
import ResetLozinke from './pages/ResetLozinke';
import AdminPanel from './pages/AdminPanel';
import OcijeniInstruktora from './pages/OcijeniInstruktora';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import Raspored from './pages/Raspored';
import ProtectedRoute from './components/ProtectedRoute';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div>Učitavanje...</div>;
  if (!user) return <Navigate to="/landing" />;
  if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
  if (user.role === 'instruktor') return <Navigate to="/instruktor" />;
  return <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetLozinke />} />
          <Route path="/dashboard" element={
            <ProtectedRoute samo={['kandidat']}><Dashboard /></ProtectedRoute>
          } />
          <Route path="/kalendar" element={
            <ProtectedRoute samo={['kandidat']}><Kalendar /></ProtectedRoute>
          } />
          <Route path="/vozila" element={
            <ProtectedRoute><Vozila /></ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute><Profil /></ProtectedRoute>
          } />
          <Route path="/instruktor" element={
            <ProtectedRoute samo={['instruktor']}><InstruktorDashboard /></ProtectedRoute>
          } />
          <Route path="/zakazi-cas" element={
            <ProtectedRoute samo={['kandidat', 'instruktor']}><ZakaziCas /></ProtectedRoute>
          } />
          <Route path="/admin-panel" element={
            <ProtectedRoute samo={['admin', 'instruktor']}><AdminPanel /></ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute samo={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/ocijeni-instruktora" element={
            <ProtectedRoute samo={['kandidat']}><OcijeniInstruktora /></ProtectedRoute>
          } />
          <Route path="/raspored" element={
            <ProtectedRoute samo={['instruktor', 'admin']}><Raspored /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}