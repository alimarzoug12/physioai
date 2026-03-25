import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
}

class Avatar extends React.Component<AvatarProps> {
  render() {
    const { src, alt, size = 'md', online = false } = this.props;
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

    return (
      <div className="relative">
        <img src={src} alt={alt} className={`${sizes[size]} rounded-full object-cover`} />
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
    );
  }
}

export default Avatar;