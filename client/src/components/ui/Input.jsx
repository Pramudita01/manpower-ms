// client/src/components/ui/Input.jsx
"use client";
import React from 'react';

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${props.className}`}
    />
  );
}