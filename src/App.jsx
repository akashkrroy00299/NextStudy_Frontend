import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import { useOrientation } from "../src/utils/useOrientation.jsx";
import { useAuthInit } from './config/useAuthInit.js';
import { UserProvider } from './context/UserContext.jsx'
import { TodoProvider } from "./context/TodoContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AppLoadingScreen from "./utils/AppLoadingScreen.jsx"
import ThemeSync from './utils/ThemeSync.jsx';

import AuthLayout from "./layouts/AuthLayout.jsx"
import MainLayout from "./layouts/MainLayout.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"

import Register from "./pages/auth/Register.jsx"
import Login from "./pages/auth/Login.jsx"
import ResetPassword from "./pages/auth/ResetPassword.jsx"

import Dashboard from "./pages/app/Dashbord.jsx"
import Activities from "./pages/app/Activities.jsx"
import ProfileAndSettings from './pages/app/Profile&Settings.jsx';
import Account from './components/Account.pf.jsx';
import Notifications from './components/Notifications.pf.jsx';
import Password from './components/Password.pf.jsx';
import Appearance from './components/Appearance.jsx';
import Logout from './components/Logout.jsx';

import Attendances from "./pages/app/Attendances.jsx"
import Habits from "./pages/app/Habits.jsx"
import Todos from "./features/todos/Todos.jsx"
import Events from "./pages/app/Events.jsx"
import Notification from './pages/app/Notification.jsx';

import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import Users from "./pages/admin/Users.jsx"
import AdminActivities from "./pages/admin/AdminActivities.jsx"
import AdminSettings from "./pages/admin/AdminSettings.jsx"

import NotFound from "./pages/error/NotFound.jsx"

const App = () => {
  const location = useLocation()
  const isLandscape = useOrientation();
  const { authChecked, isAuthenticated } = useAuthInit()

  if (!authChecked && !location.pathname.startsWith('/auth')) {
    return <AppLoadingScreen />
  }

  return (
    <UserProvider>
      <ThemeSync />
      <Routes>
        {/* auth routes */}
        <Route path="/auth" element={<AuthLayout />} >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* main routes TODO: must be protected */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout />
          </ProtectedRoute>
        } >
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<Activities />} >
            <Route index element={<Attendances />} />
            <Route path="habits" element={<Habits />} />
            <Route path="todos" element={
              <TodoProvider>
                <Todos />
              </TodoProvider>
            } />
            <Route path="events" element={<Events />} />
          </Route>

          <Route path='profile' element={<ProfileAndSettings />} >
            <Route index element={<Account />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='password' element={<Password />} />
            <Route path='appearance' element={<Appearance />} />
            <Route path='logout' element={<Logout />} />
          </Route>
          <Route path="notifications" element={<Notification />} />
        </Route>

        {/* Admin pages require an authenticated session; admin APIs must enforce roles server-side. */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        } >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App