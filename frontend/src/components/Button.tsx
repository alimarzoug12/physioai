import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
}

class Button extends React.Component<ButtonProps> {
  render() {
    const { children, variant = 'primary', onClick, disabled = false } = this.props;
    const variants: { [key: string]: string } = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    return (
      <button 
        className={`${variants[variant]} px-4 py-2 rounded-lg font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

export default Button;