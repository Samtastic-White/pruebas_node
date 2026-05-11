import { Routes, Route } from 'react-router-dom'  // ← Quita BrowserRouter de aquí
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Layout } from './shared/components/Layout'
import LoginPage from './modules/auth/pages/LoginPage'
import LandingPage from './modules/landing/pages/LandingPage'
import DashboardPage from './modules/dashboard/pages/DashboardPage'
import EventsPage from './modules/events/pages/EventsPage'
import RegistrationsPage from './modules/registrations/pages/RegistrationsPage'
import RunnersPage from './modules/runners/pages/RunnersPage'
import RegisterRunnerPage from './modules/runners/pages/RegisterRunnerPage'
import ProfilePage from './modules/auth/pages/ProfilePage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route path="/runners" element={<RunnersPage />} />
          <Route path="/register-runner" element={<RegisterRunnerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" theme="dark" />
    </QueryClientProvider>
  )
}