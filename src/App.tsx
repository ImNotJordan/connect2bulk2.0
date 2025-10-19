import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/firm/Dashboard';
import LoadBoard from './pages/firm/LoadBoard';
import TruckBoard from './pages/firm/TruckBoard';
import AdminConsole from './pages/firm/AdminConsole';
import Search from './pages/firm/Search';
import Profile from './pages/firm/Profile';
import Notifications from './pages/firm/Notifications';
import BusinessProfilePage from './pages/firm/BusinessProfile';
import ResetPassword from './pages/ResetPassword';
import AppLayout from './navigation/AppLayout';
import { LoadProvider } from './context/LoadContext';
import withAuth from './hocs/withAuth';

// Create authenticated versions of the components
const AuthenticatedDashboard = withAuth(Dashboard);
const AuthenticatedLoadBoard = withAuth(LoadBoard);
const AuthenticatedTruckBoard = withAuth(TruckBoard);
const AuthenticatedAdminConsole = withAuth(AdminConsole);
const AuthenticatedSearch = withAuth(Search);
const AuthenticatedProfile = withAuth(Profile);
const AuthenticatedNotifications = withAuth(Notifications);
const AuthenticatedBusinessProfile = withAuth(BusinessProfilePage);

// Redirect to dashboard if already signed in
function RedirectIfSignedIn({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const session = await fetchAuthSession()
        const signedIn = Boolean(session?.tokens)
        if (signedIn && mounted) {
          navigate('/firm', { replace: true })
          return
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setChecking(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [navigate])
  if (checking) return null
  return children
}

// Protect routes that require authentication
function RequireAuth({ children }: { children: React.ReactElement }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const session = await fetchAuthSession()
        if (mounted) setAllowed(Boolean(session?.tokens))
      } catch {
        if (mounted) setAllowed(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])
  if (allowed === null) return null
  return allowed ? children : <Navigate to="/login" replace />
}

function App() {
  // No additional styling needed here; each page styles itself.
  return (
    <LoadProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Auth routes (no sidebar) */}
        <Route
          path="/login"
          element={
            <RedirectIfSignedIn>
              <Login />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfSignedIn>
              <Register />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/verify"
          element={
            <RedirectIfSignedIn>
              <EmailVerification />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/reset"
          element={
            <RedirectIfSignedIn>
              <ResetPassword />
            </RedirectIfSignedIn>
          }
        />

        {/* Protected routes with sidebar layout */}
        <Route
          path="/firm"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AuthenticatedDashboard />} />
          <Route path="load-board" element={<AuthenticatedLoadBoard />} />
          <Route path="truck-board" element={<AuthenticatedTruckBoard />} />
          <Route path="admin" element={<AuthenticatedAdminConsole />} />
          <Route path="search" element={<AuthenticatedSearch />} />
          <Route path="notifications" element={<AuthenticatedNotifications />} />
          <Route path="profile" element={<AuthenticatedProfile />} />
          <Route path="business-profile" element={<AuthenticatedBusinessProfile />} />
        </Route>
      </Routes>
    </LoadProvider>
  )
}

export default App
