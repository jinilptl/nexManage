import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Members() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: members, loading } = useSelector((state) => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingMember) {
      try {
        await dispatch(
          updateUser({
            userId: editingMember._id,
            data: formData,
          }),
        ).unwrap();

        toast.success("User updated successfully");
        handleCloseModal();
      } catch (error) {
        toast.error(error || "Failed to update user");
      }
    }
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(deleteUserId)).unwrap();
      toast.success("User deleted successfully");
      closeDeleteModal();
    } catch (error) {
      toast.error(error || "Failed to delete user");
    }
  };

  const handleOpenModal = (member = null) => {
    setEditingMember(member);
    setFormData(
      member
        ? {
            name: member.name,
            email: member.email,
            role: member.role,
          }
        : {
            name: "",
            email: "",
            role: "member",
          },
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          {" "}
          <h2 className="text-2xl font-semibold text-gray-800">Members</h2>
          <p className="text-sm text-gray-500">Manage your account members</p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invite-members")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id}>
                  <td className="p-4">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4 capitalize">{member.role}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button onClick={() => handleOpenModal(member)}>
                      <Edit size={18} color="blue" />
                    </button>
                    <button onClick={() => openDeleteModal(member._id)}>
                      <Trash2 size={18} color="red" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingMember ? "Edit Member" : "Add Member"}
              </h3>
              <button onClick={handleCloseModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingMember ? "Update Member" : "Create Member"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ================= DELETE CONFIRM MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delete User
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border-gray-300 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
