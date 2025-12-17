// client/src/components/ui/Button.jsx
"use client";
import React from 'react';

export function Button({ children, type = 'button', disabled, onClick, className = '' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}