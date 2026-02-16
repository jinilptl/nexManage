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
    document.title = "Members | NexManage";
  }, []);

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
          <p className="text-sm text-gray-600">Manage your account members</p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invite-members")}
          className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 border-b text-white">
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
                <td colSpan="4" className="p-6 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-600">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr
                  key={member._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                >
                  <td className="p-4">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4 capitalize">{member.role}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleOpenModal(member)}
                      aria-label={`Edit ${member.name}`}
                      className="cursor-pointer"
                    >
                      <Edit size={18} color="blue" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(member._id)}
                      aria-label={`Delete ${member.name}`}
                      className="cursor-pointer"
                    >
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
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
            onClick={handleCloseModal}
          />

          {/* MODAL BOX */}
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMember ? "Edit Member" : "Add Member"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
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
                className="w-full bg-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full bg-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 cursor-pointer text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMember ? "Update Member" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= DELETE CONFIRM MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
            onClick={closeDeleteModal}
          />

          {/* MODAL BOX */}
          <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete User
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm cursor-pointer font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm cursor-pointer font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
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
