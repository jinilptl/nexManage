import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Search, User, Shield, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ModalSmallLoader from "../../components/Lodders/ModalSmallLoader";

export default function Members() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: members, loading } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
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

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllUsers(token));
    }
  }, [dispatch, token]);

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
        toast.error(error?.message || "Failed to update user");
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
      toast.error(error?.message || "Failed to delete user");
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

  // Filter members based on search
  const filteredMembers = members?.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return <ShieldCheck className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team Members
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your team, permissions, and roles.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invite-members")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 font-medium"
        >
          <Plus size={20} />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total Members: <span className="text-gray-900">{members?.length || 0}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ModalSmallLoader />
                      <p className="text-gray-500 text-sm">Loading members...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No members found</h3>
                      <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        {searchTerm ? "Try adjusting your search terms." : "Get started by inviting a new member to your team."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers?.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50/80 transition-colors duration-150 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                          member.role
                        )} capitalize`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 text-sm">{member.email}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100  transition-opacity">
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(member._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMember ? "Edit Member" : "Add Member"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    {/* <option value="superadmin">Super Admin</option> */}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  {editingMember ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete User
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone and will remove their access immediately.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
