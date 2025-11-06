import React from "react";

export default function DeactivateUserModal({ user, onConfirm, onClose }) {
  if (!user) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg">
          <h3 className="text-lg font-bold text-black mb-3">
            Deactivate User
          </h3>
          <p className="text-gray-700 mb-4">
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-blue-900">
              {user.first_name} {user.last_name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border border-gray-300 px-5 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition-all font-semibold"
            >
              Confirm Deactivate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
