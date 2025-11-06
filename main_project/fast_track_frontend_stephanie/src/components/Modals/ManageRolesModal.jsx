import React, { useState } from "react";

const ROLE_COLORS = {
  Admin: "bg-red-600",
  Registrar: "bg-purple-600",
  Staff: "bg-blue-600",
  Default: "bg-gray-400",
};

export default function ManageRolesModal({ roles, onClose, onSave }) {
  const [localRoles, setLocalRoles] = useState(roles || []);
  const [newRoleName, setNewRoleName] = useState("");

  // Toggle enable/disable role
  const toggleRole = (role_id) => {
    setLocalRoles((prev) =>
      prev.map((r) =>
        r.role_id === role_id ? { ...r, status_id: r.status_id === 1 ? 2 : 1 } : r
      )
    );
  };

  // Add new role handler
  const addNewRole = () => {
    if (!newRoleName.trim()) return;
    if (localRoles.some((r) => r.role_name.toLowerCase() === newRoleName.toLowerCase()))
      return alert("Role already exists.");
    const newRole = {
      role_id: Date.now(),
      role_name: newRoleName.trim(),
      status_id: 1, // enabled by default
    };
    setLocalRoles((prev) => [...prev, newRole]);
    setNewRoleName("");
  };

  // Save changes: Pass updated list up
  const saveChanges = () => {
    onSave(localRoles);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-lg flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-blue-900 text-white rounded-t-2xl p-5 text-center font-semibold text-lg">
            Manage Roles
          </div>

          {/* Roles list */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-[200px]">
            {localRoles.length === 0 && (
              <p className="text-gray-500 text-center">No roles available.</p>
            )}

            {localRoles.map((role) => {
              const roleColor = ROLE_COLORS[role.role_name] || ROLE_COLORS.Default;
              const enabled = role.status_id === 1;

              return (
                <div
                  key={role.role_id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`${roleColor} text-white text-xs font-semibold uppercase px-3 py-1 rounded-full`}
                      title={`Role: ${role.role_name}`}
                    >
                      {role.role_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status badge */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        enabled ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </span>

                    {/* Enable / Disable switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleRole(role.role_id)}
                        className="sr-only peer"
                        aria-checked={enabled}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-400 transition" />
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add new role */}
          <div className="p-6 border-t border-gray-200 flex space-x-3 items-center">
            <input
              type="text"
              placeholder="New role name"
              aria-label="New role name"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNewRole();
              }}
            />
            <button
              onClick={addNewRole}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl transition"
            >
              Add Role
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="border border-blue-900 text-blue-900 font-semibold px-6 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-800 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
