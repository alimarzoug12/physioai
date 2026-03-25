import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  label?: string;
  unit?: string;
  className?: string;
}

class Gauge extends React.Component<GaugeProps> {
  render() {
    const { value, max, label, unit = '', className = '' } = this.props;
    const progress = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={`gauge ${className}`}>
        <div className="gauge-label">{label}</div>
        <div className="gauge-value">
          {value}{unit}
        </div>
        <div className="gauge-progress">
          <div 
            className="gauge-bar" 
            style={{ width: `${progress}%` } as React.CSSProperties}
          />
        </div>
      </div>
    );
  }
}

export default Gauge;