import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Assessments from './pages/Assessments'
import TakeAssessment from './pages/TakeAssessment'
import Performance from './pages/Performance'
import SkillProfile from './pages/SkillProfile'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import AdminOverview from './pages/AdminOverview'
import AdminUsers from './pages/AdminUsers'
import AdminContent from './pages/AdminContent'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './layouts/AdminLayout'
import AttemptDetail from './pages/AttemptDetail'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Settings from './pages/Settings'
import AICoach from './pages/AICoach'
import QuestionBank from './pages/QuestionBank'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/assessments/:id/take" element={<TakeAssessment />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/skill-profile" element={<SkillProfile />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/question-bank" element={<QuestionBank />} />
       <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="content" element={<AdminContent />} />
        </Route>

        <Route path="/attempts/:id" element={<AttemptDetail />} />
      </Route>


      <Route path="/" element={<Landing />} />
    </Routes>
  )
}


export default App