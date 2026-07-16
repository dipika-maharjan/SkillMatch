import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ConfirmModal from "../components/admin/ConfirmModal";
import api from "../services/api";

export default function AdminUsers() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmPayload, setConfirmPayload] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchUsers, 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  const handleDeleteUser = (userId, fullname) => {
    setConfirmPayload({
      isOpen: true,
      title: "Delete user",
      message: `Are you sure you want to delete ${fullname}? This action cannot be undone.`,
      action: async () => {
        try {
          await api.delete(`/admin/users/${userId}`);
          setUsers((currentUsers) =>
            currentUsers.filter((u) => u._id !== userId),
          );
        } catch (error) {
          console.error("Failed to delete user:", error);
          setConfirmPayload((current) => ({
            ...current,
            isOpen: false,
          }));
          alert("Failed to delete user");
        }
      },
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert("Failed to update user role");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout
      user={user}
      title="Users"
      description="Review accounts, adjust access, and keep the platform membership healthy."
    >
      <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500 shadow-sm">
          Loading users...
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-zinc-500">Total Users</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-950">
                {filteredUsers.length}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-zinc-500">Admins</p>
              <p className="mt-1 text-2xl font-semibold text-violet-800">
                {filteredUsers.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-zinc-500">Regular Users</p>
              <p className="mt-1 text-2xl font-semibold text-sky-800">
                {filteredUsers.filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead className="border-b border-zinc-200 bg-zinc-100/70">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Role
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-zinc-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
                              {u.fullname?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-zinc-950">
                              {u.fullname}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-zinc-600">
                          {u.email}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className={`rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-teal-100 ${
                              u.role === "admin"
                                ? "border-violet-200 bg-violet-50 text-violet-800"
                                : "border-sky-200 bg-sky-50 text-sky-800"
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id, u.fullname)}
                            className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-sm text-zinc-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={confirmPayload.isOpen}
        title={confirmPayload.title}
        message={confirmPayload.message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (confirmPayload.action) {
            await confirmPayload.action();
          }
          setConfirmPayload({
            isOpen: false,
            title: "",
            message: "",
            action: null,
          });
        }}
        onCancel={() =>
          setConfirmPayload({
            isOpen: false,
            title: "",
            message: "",
            action: null,
          })
        }
      />
    </AdminLayout>
  );
}
