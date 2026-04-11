import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SplashScreen from './components/SplashScreen';
import WelcomePhysioAI from './pages/WelcomePhysioAI';
import WelcomeToPhysioAI from './pages/WelcomeToPhysioAI';
import AIAssistantCompleteFlow from './pages/AIAssistantCompleteFlow';
import PhysioBookingFlow from './pages/PhysioBookingFlow';
import SpecialistProfile from './pages/SpecialistProfile';
import BookSession from './pages/BookSession';
import PatientDashboard from './pages/PatientDashboard';
import SessionOverview from './pages/SessionOverview';
import Wallet from './pages/Wallet';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
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
import PatientHome from './pages/PatientHome';
import PatientHomeWithRouter from './pages/PatientHome';
import ProviderDashboard from './pages/ProviderDashboard';
import PhysiotherapistDashboardHeaderProps from './pages/PhysiotherapistDashboardHeader';
interface State {
  showSplash: boolean;
}

class App extends React.Component<{}, State> {
  state: State = { showSplash: true };

  handleSplashFinish = () => {
    this.setState({ showSplash: false });
  };

  render() {
    return (
      <>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/"                element={<WelcomePhysioAI />} />
              <Route path="/welcome"         element={<WelcomeToPhysioAI />} />
              <Route path="/ai-assistant"    element={<AIAssistantCompleteFlowWithRouter />} />
              <Route path="/specialists"     element={<PhysioBookingFlowWithRouter />} />
              <Route path="/specialist/:id"  element={<SpecialistProfileWithRouter />} />
              <Route path="/book"            element={<BookSessionWithRouter />} />
              <Route path="/dashboard"       element={<PatientDashboardWithRouter />} />
              <Route path="/sessions"        element={<SessionOverviewWithRouter />} />
              <Route path="/wallet"          element={<WalletWithRouter />} />
              <Route path="/notifications"   element={<NotificationsWithRouter />} />
              <Route path="/settings"        element={<SettingsWithRouter />} />
              <Route path="/smart-therapy-assistant-sidebar" element={<SmartTherapyAssistantSidebar />} />
              <Route path="/patient-home" element={<PatientHomeWithRouter />} />
              <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              <Route path="/physiotherapist-dashboard-header" element={<PhysiotherapistDashboardHeaderProps />} />
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