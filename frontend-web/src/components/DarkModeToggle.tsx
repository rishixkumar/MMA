import React, { useState } from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  const [rotation, setRotation] = useState(0);

  const handleToggle = () => {
    // Toggle rotation: 0° → -270° → 0° → -270°...
    setRotation(prev => prev === 0 ? -270 : 0);
    toggleDarkMode();
  };

  return (
    <div className="absolute top-6 right-6" style={{ position: 'absolute', top: '6px', right: '24px' }}>
      <button
        aria-label="Toggle dark mode"
        onClick={handleToggle}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/10 hover:scale-110 active:scale-95"
        style={{
          transform: `translateY(30px) rotate(${rotation}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, transform 0.3s ease',
        }}
      >
        <span 
          className={`text-2xl font-bold select-none transition-colors duration-300 ${
            darkMode ? 'text-yellow-300' : 'text-slate-600'
          }`}
          style={{
            fontFamily: 'monospace',
            lineHeight: '1',
            display: 'block',
          }}
        >
          |
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;
