import React from 'react';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';

//page 17 src/pages/PatientHome.tsx
class PatientHome extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="flex justify-between p-4 bg-white shadow">
          <button className="text-blue-500">☰</button>
          <div className="logo font-bold text-blue-600">PhysioAI</div>
          <div className="flex space-x-2">
            <button className="relative">
              🔔
              <Badge text="3" color="red" className="absolute -top-1 -right-1" />
            </button>
            <Avatar src="/avatars/sarah.jpg" alt="Sarah" size="sm" online={true} />
          </div>
        </header>

        <div className="p-4">
          <Card gradient={true} title="Welcome back, Sarah!" desc="Ready for your recovery journey today?" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card icon="📅" title="Next Session" desc="Today, 2:30 PM" />
            <Card icon="🏆" title="Weekly Goal" desc="85% Complete" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card icon="🏋️" title="Start Exercise" desc="Begin your daily routine" />
            <Card icon="📈" title="View Progress" desc="Track your improvements" />
            <Card icon="🤖" title="AI Assistant" desc="Get personalized help" />
            <Card icon="🎥" title="Telehealth" desc="Connect with therapist" />
          </div>
        </div>
      </div>
    );
  }
}

export default PatientHome;