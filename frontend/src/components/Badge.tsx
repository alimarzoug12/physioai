import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'red' | 'green' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

class Badge extends React.Component<BadgeProps> {
  render() {
    const { text, color = 'red', size = 'sm', className = '' } = this.props;
    const colors = { red: 'bg-red-500', green: 'bg-green-500', blue: 'bg-blue-500' };
    const sizes = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-1 text-sm' };

    return (
      <span className={`${colors[color]} ${sizes[size]} text-white font-bold rounded-full ${className}`}>
        {text}
      </span>
    );
  }
}

export default Badge;