import React from "react";

export default function DeleteUserModal({ user, onConfirm, onClose }) {
  if (!user) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full">
          <div className="bg-blue-900 rounded-t-2xl p-4">
            <h3 className="text-white font-semibold text-lg text-center">
              Delete User Account
            </h3>
          </div>

          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 4a4 4 0 100 8 4 4 0 000-8zM4 14s-1 0-1 1 1 4 7 4 7-3 7-4-1-1-1-1H4z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">
              Are you sure you want to delete{" "}
              <span className="text-blue-900 font-bold">
                {user.first_name} {user.last_name}
              </span>
              ?
            </p>
            <p className="text-gray-500 text-sm px-4">
              This action cannot be undone and the user will permanently lose
              access to the system.
            </p>
          </div>

          <div className="flex justify-center gap-4 pb-6 px-6">
            <button
              onClick={onConfirm}
              className="bg-blue-900 px-6 py-2 rounded-xl text-white font-semibold hover:bg-blue-800 transition"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="border border-blue-900 px-6 py-2 rounded-xl font-semibold text-blue-900 hover:bg-blue-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
