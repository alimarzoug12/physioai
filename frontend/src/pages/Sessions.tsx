import React from 'react';
import Card from '../components/Card';

class Sessions extends React.Component {
  // State avec recentSessions, upcoming, etc. comme avant
  render() {
    return (
      <div className="p-4 grid gap-4">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Render upcoming & recent with Card */}
        </div>
        {/* Home exercises, pain tracking with ProgressBar */}
      </div>
    );
  }
}

export default Sessions;