import React from 'react';

export default function ErrorDialog({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white px-6 py-10 rounded shadow-md max-w-md w-full h-60 text-center">
        <h2 className={`text-xl font-bold mb-6 ${isError ? "text-[#b86147]" : "text-[#61b327]"}`}>{isError ? 'Error' : 'Success'}</h2>
        <p className="mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 ${isError ? 'bg-[#b86147] hover:bg-[#D32F2F]' : 'bg-[#61b327] hover:bg-green-700'} text-white rounded  transition hover:cursor-pointer`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
