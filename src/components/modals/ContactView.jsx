import React from "react";

export default function ContactView({ isOpen, onClose, contact }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0  left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {contact?.firstName} {contact?.lastName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✖
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4 space-y-2">
          <label className="block text-gray-900 dark:text-white">Email:</label>
          <input
            type="text"
            value={contact?.email || ""}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
          />

          <label className="block text-gray-900 dark:text-white">Phone:</label>
          <input
            type="text"
            value={contact?.phone || ""}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
          />

          <label className="block text-gray-900 dark:text-white">
            Subject:
          </label>
          <input
            type="text"
            value={contact?.subject || ""}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
          />

          <label className="block text-gray-900 dark:text-white">
            Message:
          </label>
          <textarea
            value={contact?.message || ""}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
            rows="3"
          />
        </div>

        {/* Close button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
