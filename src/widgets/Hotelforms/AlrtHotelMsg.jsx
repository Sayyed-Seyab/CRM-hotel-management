import React from 'react';

export default function AlertHotelMsg({ isOpen, onClose, onAgree }) {
  if (!isOpen) return null; // Do not render the modal if not open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Are you sure?</h2>
        <p className="mt-4 text-gray-600">
          Are you sure you want to delete this hotel? All assigned rooms with this city will be{' '}
          <span className="text-red-600 font-bold">unassigned</span> by deleting this hotel.
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={onAgree}
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
}
