import React from 'react';

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 z-50">
      <div className="relative flex flex-col justify-center items-center text-center bg-white p-8 rounded-xl shadow-lg">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <p className='text-[#9E9E9E] mt-2'>A few seconds please</p>
      </div>
    </div>
  );
};

export default Loader;