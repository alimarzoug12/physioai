import React from 'react';

interface CardProps {
  title?: string;
  desc?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  gradient?: boolean;
  active?: boolean;
  badge?: string;
}

class Card extends React.Component<CardProps> {
  render() {
    const { title, desc, icon, children, gradient = false, active = false, badge } = this.props;

    return (
      <div className={`p-4 rounded-xl shadow-md ${gradient ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-white'} ${active ? 'border-2 border-green-500' : ''}`}>
        <div className="flex justify-between items-start">
          {icon && <div className="text-3xl mb-2">{icon}</div>}
          <div className="flex-1">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {desc && <p className="text-sm opacity-80">{desc}</p>}
          </div>
          {badge && <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{badge}</span>}
          {active && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs ml-2">Active</span>}
        </div>
        {children}
      </div>
    );
  }
}

export default Card;