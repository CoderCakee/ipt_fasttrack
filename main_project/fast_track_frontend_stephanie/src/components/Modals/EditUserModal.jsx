import React from "react";

export default function EditUserModal({
  editUser,
  editForm,
  onClose,
  onChange,
  onSave,
}) {
  if (!editUser) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
        <div className="bg-blue-900 rounded-2xl p-8 max-w-md w-full shadow-lg relative">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h3 className="text-white text-xl font-semibold mb-6 text-center">
            Edit User
          </h3>

          {/* Name */}
          <label className="block text-white font-semibold mb-1">Name</label>
          <input
            type="text"
            value={`${editForm.first_name} ${editForm.last_name}`}
            onChange={(e) => {
              const [first, ...rest] = e.target.value.split(" ");
              onChange("first_name", first || "");
              onChange("last_name", rest.join(" ") || "");
            }}
            className="w-full mb-4 rounded-xl px-4 py-2 focus:outline-none text-black"
          />

          {/* Email */}
          <label className="block text-white font-semibold mb-1">Email</label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full mb-4 rounded-xl px-4 py-2 focus:outline-none text-black"
          />

          {/* Role */}
          <label className="block text-white font-semibold mb-1">Role</label>
          <select
            value={editForm.role_name}
            onChange={(e) => onChange("role_name", e.target.value)}
            className="w-full mb-4 rounded-xl px-4 py-2 focus:outline-none text-black"
          >
            <option value="Admin">Admin</option>
            <option value="Registrar">Registrar</option>
            <option value="Staff">Staff</option>
          </select>

          {/* Department */}
          <label className="block text-white font-semibold mb-1">Department</label>
          <input
            type="text"
            value={editForm.department}
            onChange={(e) => onChange("department", e.target.value)}
            className="w-full mb-4 rounded-xl px-4 py-2 focus:outline-none text-black"
          />

          {/* Status */}
          <label className="block text-white font-semibold mb-1">Status</label>
          <select
            value={editForm.priority_category}
            onChange={(e) => onChange("priority_category", e.target.value)}
            className="w-full mb-6 rounded-xl px-4 py-2 focus:outline-none text-black"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={onSave}
            className="w-full bg-yellow-700 hover:bg-yellow-600 text-white font-semibold py-2 rounded-xl transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
