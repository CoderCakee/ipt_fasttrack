import React from "react";

export default function ResetPasswordModal({
  user,
  newPassword,
  showPassword,
  onPasswordChange,
  onClose,
  onConfirm,
}) {
  if (!user) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
          <h3 className="text-lg font-bold text-black mb-3">Reset Password</h3>
          <p className="text-gray-700 mb-4">
            Reset password for{" "}
            <span className="font-semibold text-blue-900">
              {user.first_name} {user.last_name}
            </span>
          </p>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
            value={newPassword}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border border-gray-300 px-5 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-900 text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition-all font-semibold"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
