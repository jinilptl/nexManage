import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  User,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Users,
  FolderOpen,
  CheckSquare,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ModalSmallLoader from "../../components/Lodders/ModalSmallLoader";
import NexManageLoader from "../../components/Lodders/NexManageLoader";
import Avatar from "../../components/common/Avatar";

export default function Members() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: members, loading } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMember, setDeleteMember] = useState(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

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
            token,
          }),
        ).unwrap();

        toast.success("User updated successfully");
        handleCloseModal();
      } catch (error) {
        toast.error(error?.message || "Failed to update user");
      }
    }
  };

  const openDeleteModal = (member) => {
    setDeleteMember(member);
    setConfirmChecked(false);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteMember(null);
    setConfirmChecked(false);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!confirmChecked) return;
    try {
      await dispatch(deleteUser({ userId: deleteMember._id, token })).unwrap();
      toast.success(`${deleteMember.name} has been removed successfully.`);
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

  const filteredMembers = members?.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  if (loading) {
    return (
      <div className=" flex justify-center items-center h-[70vh]">
        <NexManageLoader />
      </div>
    );
  }

  return (
    <div className="pt-5 px-4 md:px-2 pb-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-gray-900  text-2xl font-bold">Team Members</h2>
          <p className="text-gray-600">
            Manage your team, permissions, and roles.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invite-members")}
          className="flex items-center  gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 font-medium"
        >
          <Plus size={20} />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            Total Members:{" "}
            <span className="text-gray-900">{members?.length || 0}</span>
          </div>
        </div>

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
              {filteredMembers?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No members found
                      </h3>
                      <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        {searchTerm
                          ? "Try adjusting your search terms."
                          : "Get started by inviting a new member to your team."}
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
                        <Avatar
                          user={member}
                          className="w-10 h-10 ring-2 ring-white shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">
                            {member.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                          member.role,
                        )} capitalize`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 text-sm">
                        {member.email}
                      </span>
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
                          onClick={() => openDeleteModal(member)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  disabled
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 cursor-no-drop py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
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
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
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

      {isDeleteModalOpen && deleteMember && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-linear-to-r from-red-500 via-red-600 to-orange-500" />

            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      Delete Member
                    </h3>
                    <p className="text-xs text-red-500 font-medium mt-0.5">This action is permanent and irreversible</p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5">
                <Avatar user={deleteMember} className="w-10 h-10 ring-2 ring-white shadow" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{deleteMember.name}</p>
                  <p className="text-xs text-gray-500">{deleteMember.email}</p>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(deleteMember.role)} capitalize`}>
                  {getRoleIcon(deleteMember.role)}
                  {deleteMember.role}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Deleting <span className="font-semibold text-gray-900">{deleteMember.name}</span> will immediately and permanently:
              </p>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Remove from all Teams</p>
                    <p className="text-xs text-gray-500 mt-0.5">They will be instantly removed from every team they belong to.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderOpen className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Remove from all Projects</p>
                    <p className="text-xs text-gray-500 mt-0.5">Their membership in all projects will be revoked permanently.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                  <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckSquare className="w-3.5 h-3.5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Unassign from all Tasks</p>
                    <p className="text-xs text-gray-500 mt-0.5">All tasks assigned to them will become unassigned.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <LogOut className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Revoke Account Access</p>
                    <p className="text-xs text-gray-500 mt-0.5">Their account and login access will be permanently removed.</p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none mb-5 group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${confirmChecked
                      ? "bg-red-600 border-red-600"
                      : "bg-white border-gray-300 group-hover:border-red-400"
                    }`}
                    style={{ width: "18px", height: "18px" }}
                  >
                    {confirmChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  I understand this action is <span className="font-semibold text-gray-900">permanent</span> and cannot be undone.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={!confirmChecked}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl shadow transition-all ${confirmChecked
                      ? "bg-red-600 hover:bg-red-700 text-white active:scale-95 cursor-pointer"
                      : "bg-red-200 text-red-400 cursor-not-allowed"
                    }`}
                >
                  <Trash2 size={16} />
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
