
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  return (
    <select
      className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
