import React from 'react';

const Loading = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-primary-600`}></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;