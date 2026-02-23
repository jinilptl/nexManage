import React, { useState } from "react";
import { X, Mail, Loader2, Users } from "lucide-react";

export default function InviteProjectMemberModal({ isOpen, onClose, onSubmit, loading }) {
    const [email, setEmail] = useState("");
    const [inviteType, setInviteType] = useState("member");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        onSubmit({ email, inviteType });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">Invite Member</h3>
                    <button
                        onClick={() => onClose(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                className={`block w-full pl-10 pr-3 py-2.5 bg-gray-50 border ${error ? "border-red-500" : "border-gray-200"
                                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                                placeholder="example@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Invitation Role
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setInviteType("member")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${inviteType === "member"
                                    ? "border-blue-500 bg-blue-50/50 text-blue-700"
                                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                    }`}
                            >
                                <Users className={`w-6 h-6 mb-2 ${inviteType === "member" ? "text-blue-600" : "text-gray-400"}`} />
                                <span className="text-sm font-semibold">Member</span>
                                <span className="text-[10px] opacity-70 mt-1 text-center leading-tight">Standard Project Member</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setInviteType("observer")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${inviteType === "observer"
                                    ? "border-blue-500 bg-blue-50/50 text-blue-700"
                                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                    }`}
                            >
                                <Mail className={`w-6 h-6 mb-2 ${inviteType === "observer" ? "text-blue-600" : "text-gray-400"}`} />
                                <span className="text-sm font-semibold">Observer</span>
                                <span className="text-[10px] opacity-70 mt-1 text-center leading-tight">Temporary/Guest Access</span>
                            </button>
                        </div>
                        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed italic">
                            {inviteType === "member"
                                ? "Members are registered as full users immediately."
                                : "Observers are added as temp members and hidden from team selection."}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Inviting...
                                </>
                            ) : (
                                "Invite Member"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
