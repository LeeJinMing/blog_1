import React from 'react';
import { useNavigation } from '@/hooks/useNavigation';

interface BackButtonProps {
  fallbackPath?: string;
  children?: React.ReactNode;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/',
  children = 'Back',
  className = 'inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'
}) => {
  const { goBack } = useNavigation();

  const handleClick = () => {
    goBack(fallbackPath);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </button>
  );
}; 