'use client';

import React from 'react';

const LoaderOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <div className="mt-4 text-white font-medium text-center">Processing...</div>
      </div>
    </div>
  );
};

export default LoaderOverlay;