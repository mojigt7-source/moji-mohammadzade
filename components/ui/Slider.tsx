
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider: React.FC<SliderProps> = ({ className, ...props }) => {
  return (
    <input
      type="range"
      className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-pink-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none
       ${className}`}
      {...props}
    />
  );
};
