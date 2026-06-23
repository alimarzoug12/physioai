import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './components/SplashScreen';
import AdminGuard from './components/AdminGuard';
import NonAdminGuard from './components/NonAdminGuard';
import WelcomePhysioAI from './pages/WelcomePhysioAI';
import WelcomeToPhysioAI from './pages/WelcomeToPhysioAI';
import PatientDashboardWithRouter from './pages/PatientDashboard';
import BookSessionWithRouter from './pages/BookSession';
import SpecialistProfileWithRouter from './pages/SpecialistProfile';
import SessionOverviewWithRouter from './pages/SessionOverview';
import WalletWithRouter from './pages/Wallet';
import SettingsWithRouter from './pages/Settings';
import NotificationsWithRouter from './pages/Notifications';
import AIAssistantCompleteFlowWithRouter from './pages/AIAssistantCompleteFlow';
import SmartTherapyAssistantSidebar from './pages/SmartTherapyAssistantSidebar';
import PhysioBookingFlowWithRouter from './pages/PhysioBookingFlow';
import PatientHomeWithRouter from './pages/PatientHome';
import PhysiotherapistDashboardHeader from './pages/PhysiotherapistDashboardHeader';
import ProviderDashboardWithRouter from './pages/ProviderDashboard';
import {
  authApi,
  startTokenRefreshTimer, stopTokenRefreshTimer,
} from './services/auth';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import PaymentCallback from './pages/PaymentCallback';
import ScheduleManager from './pages/ScheduleManager';
import AdminDashboard from './pages/AdminDashboard';

interface State {
  showSplash:  boolean;
  authChecked: boolean;
}

class App extends React.Component<{}, State> {
  state: State = { showSplash: true, authChecked: false };

  async componentDidMount() {
    const ok = await authApi.silentRefresh();
    if (ok) startTokenRefreshTimer();
    this.setState({ authChecked: true });
    window.addEventListener('auth:logout', this.handleLogout);
  }

  componentWillUnmount() {
    window.removeEventListener('auth:logout', this.handleLogout);
    stopTokenRefreshTimer();
  }

  handleLogout = () => {
    stopTokenRefreshTimer();
    this.setState({});
  };

  handleSplashFinish = () => {
    this.setState({ showSplash: false });
  };

  render() {
    const { showSplash, authChecked } = this.state;

    if (!authChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <>
        <Router>
          <div className="app-container">
            <Routes>

              {/* ── Public routes ─────────────────────────── */}
              <Route path="/" element={<WelcomePhysioAI />} />
              <Route path="/welcome" element={<WelcomeToPhysioAI />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />

              {/* ── Admin only ─────────────────────────────── */}
              <Route path="/admin-dashboard" element={
                <AdminGuard><AdminDashboard /></AdminGuard>
              } />

              {/* ── Patient/Doctor routes ──────────────────── */}
              <Route path="/dashboard" element={
                <NonAdminGuard><PatientDashboardWithRouter /></NonAdminGuard>
              } />
              <Route path="/ai-assistant" element={
                <NonAdminGuard><AIAssistantCompleteFlowWithRouter /></NonAdminGuard>
              } />
              <Route path="/specialists" element={
                <NonAdminGuard><PhysioBookingFlowWithRouter /></NonAdminGuard>
              } />
              <Route path="/specialist/:id" element={
                <NonAdminGuard><SpecialistProfileWithRouter /></NonAdminGuard>
              } />
              <Route path="/book/:doctorId?" element={
                <NonAdminGuard><BookSessionWithRouter /></NonAdminGuard>
              } />
              <Route path="/sessions" element={
                <NonAdminGuard><SessionOverviewWithRouter /></NonAdminGuard>
              } />
              <Route path="/wallet" element={
                <NonAdminGuard><WalletWithRouter /></NonAdminGuard>
              } />
              <Route path="/notifications" element={
                <NonAdminGuard><NotificationsWithRouter /></NonAdminGuard>
              } />
              <Route path="/settings" element={
                <NonAdminGuard><SettingsWithRouter /></NonAdminGuard>
              } />
              <Route path="/smart-therapy-assistant-sidebar" element={
                <NonAdminGuard><SmartTherapyAssistantSidebar /></NonAdminGuard>
              } />
              <Route path="/patient-home" element={
                <NonAdminGuard><PatientHomeWithRouter /></NonAdminGuard>
              } />
              <Route path="/provider-dashboard" element={
                <NonAdminGuard><ProviderDashboardWithRouter /></NonAdminGuard>
              } />
              <Route path="/physiotherapist-dashboard-header" element={
                <NonAdminGuard><PhysiotherapistDashboardHeader /></NonAdminGuard>
              } />
              <Route path="/schedule" element={
                <NonAdminGuard><ScheduleManager /></NonAdminGuard>
              } />

              {/* ── Fallback ───────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </Router>

        {showSplash && <SplashScreen onFinish={this.handleSplashFinish} />}
      </>
    );
  }
}

export default App;