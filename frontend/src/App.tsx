import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import IdeaValidator from './pages/IdeaValidator'
import MarketResearch from './pages/MarketResearch'
import CompetitorAnalysis from './pages/CompetitorAnalysis'
import BusinessModel from './pages/BusinessModel'
import FinancialForecast from './pages/FinancialForecast'
import BrandAssets from './pages/BrandAssets'
import PitchDeck from './pages/PitchDeck'
import MVPScoper from './pages/MVPScoper'
import UserPersonas from './pages/UserPersonas'
import GTMStrategy from './pages/GTMStrategy'
import LegalCompliance from './pages/LegalCompliance'
import GrowthExperiments from './pages/GrowthExperiments'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/projects/:id/validator" element={<IdeaValidator />} />
          <Route path="/dashboard/projects/:id/market-research" element={<MarketResearch />} />
          <Route path="/dashboard/projects/:id/competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="/dashboard/projects/:id/business-model" element={<BusinessModel />} />
          <Route path="/dashboard/projects/:id/financial-forecast" element={<FinancialForecast />} />
          <Route path="/dashboard/projects/:id/brand-assets" element={<BrandAssets />} />
          <Route path="/dashboard/projects/:id/pitch-deck" element={<PitchDeck />} />
          <Route path="/dashboard/projects/:id/mvp-scoper" element={<MVPScoper />} />
          <Route path="/dashboard/projects/:id/user-personas" element={<UserPersonas />} />
          <Route path="/dashboard/projects/:id/gtm-strategy" element={<GTMStrategy />} />
          <Route path="/dashboard/projects/:id/legal-compliance" element={<LegalCompliance />} />
          <Route path="/dashboard/projects/:id/growth-experiments" element={<GrowthExperiments />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
