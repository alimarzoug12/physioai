import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PatientHome from './pages/PatientHome';
import PatientDashboard from './pages/PatientDashboard';
import Sessions from './pages/Sessions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import MultiRoleSwitch from './pages/MultiRoleSwitch';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<PatientHome />} />
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/sessions" element={<Sessions />} />            
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />            
            <Route path="/switch-role" element={<MultiRoleSwitch />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;