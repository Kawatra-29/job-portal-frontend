import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import SidebarLayout from "../components/SidebarLayout";
import ConfirmModal from "../components/ConfirmModal";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faTrashCan,
  faChevronLeft,
  faChevronRight,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [deleteEmail, setDeleteEmail] = useState(null);
  const [verifyCompanyId, setVerifyCompanyId] = useState("");
  const [actionMessage, setActionMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const navItems = [
    { icon: "🛡️", label: "User Management", path: "/dashboard/admin", active: true },
    { icon: "🔍", label: "Jobs Catalog", path: "/jobs" },
    { icon: "🏢", label: "Companies Directory", path: "/companies" },
  ];

  // Fetch paginated registered users
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "users", page, size],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/users?page=${page}&size=${size}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const users = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || users.length;

  const confirmDeleteUser = async () => {
    if (!deleteEmail) return;
    setProcessing(true);
    setActionMessage(null);
    try {
      await apiClient.delete(`/admin/users/${encodeURIComponent(deleteEmail)}`);
      setActionMessage({ type: "success", text: `User ${deleteEmail} deactivated successfully.` });
      refetch();
    } catch (err) {
      setActionMessage({ type: "error", text: err.response?.data?.message || "Failed to delete user." });
    } finally {
      setProcessing(false);
      setDeleteEmail(null);
    }
  };

  const handleVerifyEmployer = async (e) => {
    e.preventDefault();
    if (!verifyCompanyId.trim()) return;
    setProcessing(true);
    setActionMessage(null);
    try {
      await apiClient.post(`/admin/employers/${verifyCompanyId.trim()}/verify`, {});
      setActionMessage({ type: "success", text: `Employer #${verifyCompanyId} marked as verified!` });
      setVerifyCompanyId("");
      refetch();
    } catch (err) {
      setActionMessage({ type: "error", text: err.response?.data?.message || "Failed to verify employer ID." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SidebarLayout
      navItems={navItems}
      title="Platform Administration"
      subtitle="Superuser controls, user directory, and trust verification"
    >
      <Helmet>
        <title>Admin Dashboard | STRIDE</title>
        <meta name="description" content="Superuser console for managing registered users and company verifications." />
      </Helmet>

      <div className="space-y-6">
        
        {/* Verification & Action Feedback */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
              actionMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200"
            }`}
          >
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer p-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Action: Employer Verification */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600 text-sm" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                  Verify Employer Credibility
                </h3>
              </div>
              <p className="text-xs text-slate-400 m-0">
                Grants the official Verified Partner badge to an employer organization.
              </p>
            </div>

            <form onSubmit={handleVerifyEmployer} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={verifyCompanyId}
                onChange={(e) => setVerifyCompanyId(e.target.value)}
                placeholder="Employer ID (e.g. 1)"
                className="w-full sm:w-48 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={processing || !verifyCompanyId.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer border-none shadow-sm shrink-0"
              >
                {processing ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                Registered Platform Users
              </h3>
              <p className="text-xs text-slate-400 m-0 mt-0.5">
                Total accounts registered: <strong className="text-slate-800 dark:text-slate-200">{totalElements}</strong>
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
            >
              <FontAwesomeIcon icon={faRotateRight} className={isFetching ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-600 dark:text-rose-400 text-xs font-semibold">
              Failed to load user directory. Ensure you have ADMIN role privileges.
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No registered users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id || u.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {u.fname || "Unnamed Member"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                              : u.role === "EMPLOYER"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.phone || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteEmail(u.email)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-none bg-transparent cursor-pointer"
                          title="Deactivate account"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer bg-transparent"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Prev
            </button>
            <span>
              Page {page + 1} of {totalPages || 1}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer bg-transparent"
            >
              Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteEmail)}
        title="Deactivate User Account"
        message={`Are you sure you want to deactivate the user "${deleteEmail}"? This action cannot be reversed.`}
        confirmText={processing ? "Processing..." : "Confirm Deactivation"}
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteEmail(null)}
        isLoading={processing}
        isDanger={true}
      />
    </SidebarLayout>
  );
}
