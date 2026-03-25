import React from 'react';
import Card from '../components/Card';

class MultiRoleSwitch extends React.Component {
  render() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Switch Role</h1>
        <Card title="Patient Portal" desc="Personal health journey" active={true} />
        <Card title="Physiotherapist" desc="Professional practice" badge="24 Patients" />
        <Card title="Health Center" desc="Facility management" badge="4 Locations" />
      </div>
    );
  }
}

export default MultiRoleSwitch;