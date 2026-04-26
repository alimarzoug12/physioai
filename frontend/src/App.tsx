import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './components/SplashScreen';
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
  authApi, tokenStore,
  startTokenRefreshTimer, stopTokenRefreshTimer,
} from './services/auth';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import PaymentCallback from './pages/PaymentCallback';
interface State {
  showSplash:    boolean;
  authChecked:   boolean;
  isLoggedIn:    boolean;
}

class App extends React.Component<{}, State> {
  state: State = { showSplash: true, authChecked: false, isLoggedIn: false };

  async componentDidMount() {
    // Try to restore session via silent refresh on app load
    const ok = await authApi.silentRefresh();
    if (ok) {
      startTokenRefreshTimer();
      this.setState({ isLoggedIn: true, authChecked: true });
    } else {
      this.setState({ isLoggedIn: false, authChecked: true });
    }

    // Listen for logout events (from apiFetch on 401)
    window.addEventListener('auth:logout', this.handleLogout);
  }

  componentWillUnmount() {
    window.removeEventListener('auth:logout', this.handleLogout);
    stopTokenRefreshTimer();
  }

  handleLogout = () => {
    stopTokenRefreshTimer();
    this.setState({ isLoggedIn: false });
  };

  handleSplashFinish = () => {
    this.setState({ showSplash: false });
  };

  render() {
    const { showSplash, authChecked, isLoggedIn } = this.state;

    if (!authChecked) {
      // Wait for silent refresh check before rendering routes
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
              <Route path="/" element={<WelcomePhysioAI />} />
              <Route path="/welcome" element={<WelcomeToPhysioAI />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />

              <Route path="/ai-assistant" element={isLoggedIn ? <AIAssistantCompleteFlowWithRouter /> : <Navigate to="/" />} />
              <Route path="/specialists" element={isLoggedIn ? <PhysioBookingFlowWithRouter /> : <Navigate to="/" />} />
              <Route path="/specialist/:id" element={isLoggedIn ? <SpecialistProfileWithRouter /> : <Navigate to="/" />} />
              <Route path="/book/:doctorId?" element={isLoggedIn ? <BookSessionWithRouter /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={isLoggedIn ? <PatientDashboardWithRouter /> : <Navigate to="/" />} />
              <Route path="/sessions" element={isLoggedIn ? <SessionOverviewWithRouter /> : <Navigate to="/" />} />
              <Route path="/wallet" element={isLoggedIn ? <WalletWithRouter /> : <Navigate to="/" />} />
              <Route path="/notifications" element={isLoggedIn ? <NotificationsWithRouter /> : <Navigate to="/" />} />
              <Route path="/settings" element={isLoggedIn ? <SettingsWithRouter /> : <Navigate to="/" />} />
              <Route path="/smart-therapy-assistant-sidebar" element={isLoggedIn ? <SmartTherapyAssistantSidebar /> : <Navigate to="/" />} />
              <Route path="/patient-home" element={isLoggedIn ? <PatientHomeWithRouter /> : <Navigate to="/" />} />
              <Route path="/provider-dashboard" element={isLoggedIn ? <ProviderDashboardWithRouter /> : <Navigate to="/" />} />
              <Route path="/physiotherapist-dashboard-header" element={isLoggedIn ? <PhysiotherapistDashboardHeader /> : <Navigate to="/" />} />                           
            </Routes>
          </div>
        </Router>

        {this.state.showSplash && (
          <SplashScreen onFinish={this.handleSplashFinish} />
        )}
      </>
    );
  }
}

export default App;