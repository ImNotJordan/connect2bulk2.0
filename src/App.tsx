import React, { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { fetchAuthSession } from 'aws-amplify/auth'
import { LoadProvider } from './context/LoadContext'
import { SearchProvider } from './contexts/SearchContext'

// Lazy load components for code splitting
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const EmailVerification = lazy(() => import('./pages/EmailVerification'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const AppLayout = lazy(() => import('./navigation/AppLayout'))
const Dashboard = lazy(() => import('./pages/firm/Dashboard'))
const LoadBoard = lazy(() => import('./pages/firm/LoadBoard'))
const TruckBoard = lazy(() => import('./pages/firm/TruckBoard'))
const AdminConsole = lazy(() => import('./pages/firm/AdminConsole'))
const Search = lazy(() => import('./pages/firm/Search'))
const Profile = lazy(() => import('./pages/firm/Profile'))
const Notifications = lazy(() => import('./pages/firm/Notifications'))
const BusinessProfilePage = lazy(() => import('./pages/firm/BusinessProfile'))
const Settings = lazy(() => import('./pages/firm/Settings'))
const UnderConstruction = lazy(() => import('./pages/firm/UnderConstruction'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
)

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
    <SearchProvider>
      <LoadProvider>
        <Suspense fallback={<LoadingFallback />}>
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
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/firm" element={<Dashboard />} />
          <Route path="/firm/load-board" element={<LoadBoard />} />
          <Route path="/firm/truck-board" element={<TruckBoard />} />
          <Route path="/firm/admin" element={<AdminConsole />} />
          <Route path="/firm/search" element={<Search />} />
          <Route path="/firm/notifications" element={<Notifications />} />
          <Route path="/firm/profile" element={<Profile />} />
          <Route path="/firm/business-profile" element={<BusinessProfilePage />} />
          <Route path="/firm/settings" element={<Settings />} />
          <Route path="/firm/bidding" element={<UnderConstruction title="Bidding" />} />
          <Route path="/firm/risk-models" element={<UnderConstruction title="Risk Models" />} />
          <Route path="/firm/rfps" element={<UnderConstruction title="RFPs" />} />
          <Route path="/firm/quotes" element={<UnderConstruction title="Quotes" />} />
          <Route path="/firm/analytics" element={<UnderConstruction title="Analytics" />} />
          <Route path="/firm/carriers-brokers" element={<UnderConstruction title="Carriers/Brokers" />} />
          <Route path="/firm/tracking" element={<UnderConstruction title="Tracking" />} />
          <Route path="/firm/communications" element={<UnderConstruction title="Communications" />} />
          <Route path="/firm/accounting" element={<UnderConstruction title="Accounting" />} />
          <Route path="/firm/crm" element={<UnderConstruction title="CRM" />} />
        </Route>
        </Routes>
        </Suspense>
      </LoadProvider>
    </SearchProvider>
  )
}

export default App
