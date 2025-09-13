
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses = "font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400',
  };

  const sizeClasses = {
      md: 'px-4 py-2 text-sm',
      icon: 'p-2'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
