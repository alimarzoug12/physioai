import React from 'react';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Card from '../components/Card';

//page 7 src/pages/PatientDashboardd.tsx
class PatientDashboard extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Similaire au header de PatientHome */}
        <div className="p-4">
          <Avatar src="/avatars/sarah.jpg" alt="Sarah Johnson" size="lg" online={true} />
          <h2>Sarah Johnson</h2>
          <div className="stats flex space-x-4">
            <Card title="Sessions" desc="24" />
            <Card title="Progress" desc="85%" />
            <Card title="Streak" desc="12" />
          </div>
          <div className="switch-role mt-4">
            <h3>Switch Role</h3>
            <Card title="Patient Portal" desc="Personal health journey" active={true} />
            <Card title="Physiotherapist" desc="Professional practice" badge="24 Patients" />
            <Card title="Health Center" desc="Facility management" badge="4 Locations" />
          </div>
          <Card title="Today's Achievement" desc="Completed 3 exercises • 45 min session" />
          {/* Ajoute sections pour tools, vital, communication, etc. comme dans captures */}
        </div>
      </div>
    );
  }
}

export default PatientDashboard;