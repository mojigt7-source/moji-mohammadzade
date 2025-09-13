
import React from 'react';
import { CaptionGenerator } from './components/CaptionGenerator';
import { GithubIcon } from './components/ui/Icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="py-4 px-6 md:px-8 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-pink-500"
            >
              <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.16 12.84 9 12 9H7.5A3.75 3.75 0 013.75 5.25v-1.5C3.75 2.84 4.59 2 5.625 2h1.875v1.375z" />
              <path d="M13.5 14.25a3.75 3.75 0 013.75-3.75h3.375a3.75 3.75 0 013.75 3.75v3.375a3.75 3.75 0 01-3.75 3.75h-3.375a3.75 3.75 0 01-3.75-3.75V14.25zM21 16.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM8.25 12.75a3.75 3.75 0 00-3.75 3.75v3.375a3.75 3.75 0 003.75 3.75h3.375a3.75 3.75 0 003.75-3.75v-3.375a3.75 3.75 0 00-3.75-3.75H8.25zM12 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight">
              دستیار کپشن اینستاگرام
            </h1>
          </div>
          <a
            href="https://github.com/google/genai-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <CaptionGenerator />
      </main>

      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-8">
        <p>ساخته شده با هوش مصنوعی مولد. این یک پروژه نمایشی است.</p>
      </footer>
    </div>
  );
};

export default App;