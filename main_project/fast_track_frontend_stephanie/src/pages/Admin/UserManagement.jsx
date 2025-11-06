import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import EditUserModal from "../../components/Modals/EditUserModal";
import DeleteUserModal from "../../components/Modals/DeleteUserModal";
import DeactivateUserModal from "../../components/Modals/DeactivateUserModal";
import ResetPasswordModal from "../../components/Modals/ResetPasswordModal";
import AddUserModal from "../../components/Modals/AddUserModal";
import ManageRolesModal from "../../components/Modals/ManageRolesModal";

const usersMock = [
  {
    user_id: 1,
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@auf.edu.ph",
    role_name: "Admin",
    role_color: "bg-red-500",
    priority_category: "Active",
    priority_color: "bg-green-300",
    department: "Registrar's Office",
    last_login: "9/16/2024, 9:30:00 AM",
    created_at: "2024-01-15",
  },
  {
    user_id: 2,
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@auf.edu.ph",
    role_name: "Staff",
    role_color: "bg-indigo-400",
    priority_category: "Active",
    priority_color: "bg-green-300",
    department: "Registrar's Office",
    last_login: "9/16/2024, 9:30:00 AM",
    created_at: "2024-01-15",
  },
  {
    user_id: 3,
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@auf.edu.ph",
    role_name: "Admin",
    role_color: "bg-red-500",
    priority_category: "Active",
    priority_color: "bg-green-300",
    department: "Registrar's Office",
    last_login: "9/16/2024, 9:30:00 AM",
    created_at: "2024-01-15",
  },
];

export default function UserManagement() {
  // --- Modal states ---
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deactivateUser, setDeactivateUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_name: "",
    department: "",
    priority_category: "",
  });

  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_name: "",
    department: "",
    priority_category: "",
  });

  // Sample roles data
  const [rolesData, setRolesData] = useState([
    { role_id: 1, role_name: "Admin", status_id: 1 },
    { role_id: 2, role_name: "Registrar", status_id: 1 },
    { role_id: 3, role_name: "Staff", status_id: 1 },
  ]);

  // --- Edit handlers ---
  const handleEditUser = (userId) => {
    const user = usersMock.find((u) => u.user_id === userId);
    if (user) {
      setEditUser(user);
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_name: user.role_name,
        department: user.department,
        priority_category: user.priority_category,
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    alert(
      `User updated:\nName: ${editForm.first_name} ${editForm.last_name}\nEmail: ${editForm.email}\nRole: ${editForm.role_name}\nDepartment: ${editForm.department}\nStatus: ${editForm.priority_category}`
    );
    setEditUser(null);
  };

  const handleAddUserOpen = () => setAddUser(true);

  const handleAddChange = (field, value) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewUser = () => {
    alert(
      `New user added:\nName: ${addForm.first_name} ${addForm.last_name}\nEmail: ${addForm.email}\nRole: ${addForm.role_name}\nDepartment: ${addForm.department}\nStatus: ${addForm.priority_category}`
    );
    setAddUser(false);
    setAddForm({
      first_name: "",
      last_name: "",
      email: "",
      role_name: "",
      department: "",
      priority_category: "",
    });
  };

  const handleDeleteUser = (userId) => {
    const user = usersMock.find((u) => u.user_id === userId);
    if (user) setDeleteUser(user);
  };

  const handleDeactivateUser = (user) => setDeactivateUser(user);
  const handleResetPassword = (user) => setResetUser(user);

  const handleManageRolesOpen = () => setManageRolesOpen(true);

  return (
    <AdminLayout>
      <div className="p-6 max-w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">User Management</h1>
            <p className="text-gray-600">
              Manage system users and access permissions
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleManageRolesOpen}
              className="bg-yellow-600 text-white rounded-xl px-4 py-2 hover:bg-yellow-700 transition-all"
            >
              Manage Roles
            </button>
            <button
              onClick={handleAddUserOpen}
              className="bg-blue-900 text-white rounded-xl px-4 py-2 hover:bg-blue-800 transition-all"
            >
              Add User
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="border border-blue-200 rounded-2xl p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">
            System Users ({usersMock.length})
          </h2>

          <div className="space-y-6">
            {usersMock.map((user) => (
              <div
                key={user.user_id}
                className="border border-gray-300 rounded-xl p-4 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                {/* Left */}
                <div className="md:w-2/3 mb-4 md:mb-0">
                  <div className="flex flex-wrap items-center space-x-2 font-semibold text-blue-900 mb-1">
                    <span>
                      {user.first_name} {user.last_name}
                    </span>
                    <span
                      className={`text-white text-xs px-2 py-0.5 rounded ${user.role_color}`}
                    >
                      {user.role_name}
                    </span>
                    <span
                      className={`text-green-900 text-xs px-2 py-0.5 rounded ${user.priority_color}`}
                    >
                      {user.priority_category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-0.5">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.department}</div>
                  <div className="text-xs text-gray-600 mt-3 grid grid-cols-2 gap-y-1">
                    <div>
                      <span className="font-semibold">Last Login</span>
                      <div>{user.last_login}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Created</span>
                      <div>{user.created_at}</div>
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleDeactivateUser(user)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Deactivate
                  </button>

                  <button
                    onClick={() => handleResetPassword(user)}
                    className="bg-blue-900 text-white rounded-lg px-3 py-1 flex items-center space-x-1 hover:bg-blue-800 transition-all"
                  >
                    <span>Reset Password</span>
                  </button>

                  <button
                    onClick={() => handleEditUser(user.user_id)}
                    className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all flex items-center justify-center"
                    title="Edit User"
                  >
                    <img src={editIcon} alt="Edit" className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.user_id)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center"
                    title="Delete User"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Imported Modals --- */}
        {editUser && (
          <EditUserModal
            editUser={editUser}
            editForm={editForm}
            onClose={() => setEditUser(null)}
            onChange={handleEditChange}
            onSave={handleSaveChanges}
          />
        )}

        {addUser && (
          <AddUserModal
            addForm={addForm}
            onClose={() => setAddUser(false)}
            onChange={handleAddChange}
            onSave={handleSaveNewUser}
          />
        )}

        {deleteUser && (
          <DeleteUserModal
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
            onConfirm={() => {
              alert(
                `User ${deleteUser.first_name} ${deleteUser.last_name} deleted!`
              );
              setDeleteUser(null);
            }}
          />
        )}

        {deactivateUser && (
          <DeactivateUserModal
            user={deactivateUser}
            onClose={() => setDeactivateUser(null)}
            onConfirm={() => {
              alert(
                `User ${deactivateUser.first_name} ${deactivateUser.last_name} deactivated!`
              );
              setDeactivateUser(null);
            }}
          />
        )}

        {resetUser && (
          <ResetPasswordModal
            user={resetUser}
            onClose={() => setResetUser(null)}
            onConfirm={(newPass) => {
              alert(
                `Password for ${resetUser.first_name} ${resetUser.last_name} reset to: ${newPass}`
              );
              setResetUser(null);
            }}
          />
        )}

        {manageRolesOpen && (
          <ManageRolesModal
            roles={rolesData}
            onClose={() => setManageRolesOpen(false)}
            onSave={(updatedRoles) => {
              setRolesData(updatedRoles);
              setManageRolesOpen(false);
              alert("Roles updated!");
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
