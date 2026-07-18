import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// --- BASE QUERY: Single call to GET /employer/all-applications ---
// Accepts optional TanStack Query overrides (e.g. { select }) for derived hooks.
// TanStack Query deduplicates by queryKey: same key = ONE network request,
// even if multiple components call this simultaneously.
function useAllEmployerApplications(options = {}) {
  return useQuery({
    queryKey: ["employer", "all-applications"],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/all-applications`, authHeader());
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
    ...options,   // allows callers to pass select, enabled, etc.
  });
}

// --- EMPLOYER STATS (derived from single /employer/all-applications call) ---
export function useEmployerStats() {
  // We still need job count from /employer/jobs for activeJobPosts
  const jobsQuery = useQuery({
    queryKey: ["employer", "jobs", "active"],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/jobs`, authHeader());
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const appsQuery = useAllEmployerApplications();

  const apps = appsQuery.data || [];
  const jobs = jobsQuery.data || [];

  return {
    isLoading: jobsQuery.isLoading || appsQuery.isLoading,
    error: jobsQuery.error || appsQuery.error,
    data: {
      activeJobPosts: jobs.filter((j) => j.status === "OPEN").length,
      totalApplicants: apps.length,
      shortlisted: apps.filter(
        (a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW" || a.status === "HIRED"
      ).length,
      interviewsToday: apps.filter((a) => a.status === "INTERVIEW").length,
    },
  };
}

// --- RECENT APPLICANTS — uses shared /employer/all-applications cache ---
// `select` transforms the cached data without making a new API call.
export function useRecentApplicants(limit = 5) {
  return useAllEmployerApplications({
    select: (apps) =>
      [...apps]
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, limit),
  });
}

// --- ACTIVE JOBS — GET /employer/jobs (unchanged) ---
export function useActiveJobs() {
  return useQuery({
    queryKey: ["employer", "jobs", "active"],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/jobs`, authHeader());
      const jobs = res.data || [];
      // OPEN jobs first
      return jobs.sort((a, b) => {
        if (a.status === "OPEN" && b.status !== "OPEN") return -1;
        if (b.status === "OPEN" && a.status !== "OPEN") return 1;
        return 0;
      });
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

// --- ALL APPLICANTS (dedicated page) — uses shared /employer/all-applications ---
export function useAllApplicants(page = 0, size = 10, filters = {}) {
  return useQuery({
    queryKey: ["employer", "applicants", "all", page, size, filters],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/all-applications`, authHeader());
      const allApps = Array.isArray(res.data) ? res.data : [];

      // Apply filters client-side
      let filtered = allApps;
      if (filters.status) {
        filtered = filtered.filter((a) => a.status === filters.status);
      }

      // Client-side pagination
      const start = page * size;
      return {
        content: filtered.slice(start, start + size),
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
      };
    },
    staleTime: 1000 * 60 * 1,
    placeholderData: (prev) => prev,
    retry: 1,
  });
}

// --- EMPLOYER JOB POSTS LIST ---
export function useEmployerJobs(page = 0, size = 10) {
  return useQuery({
    queryKey: ["employer", "jobs", "list", page],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/jobs?page=${page}&size=${size}`, authHeader());
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
    retry: 1,
  });
}

// --- SINGLE JOB DETAIL (employer view) ---
export function useEmployerJob(jobId) {
  return useQuery({
    queryKey: ["employer", "jobs", "detail", jobId],
    queryFn: async () => {
      const res = await axios.get(`${API}/jobs/${jobId}`, authHeader());
      return res.data;
    },
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

// --- EMPLOYER PROFILE (uses real API: GET /api/v1/employer/me) ---
export function useEmployerProfile() {
  return useQuery({
    queryKey: ["employer", "profile"],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/me`, authHeader());
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// --- USER INFO (GET /api/v1/users/me) for employer's personal details ---
export function useUserMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await axios.get(`${API}/users/me`, authHeader());
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// --- UPDATE USER PERSONAL INFO (PUT /api/v1/users/me) ---
// Accepts User fields: fullName, email, phone
export function useUpdateUserMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await axios.put(`${API}/users/me`, userData, authHeader());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

// --- UPDATE PASSWORD (PUT /api/v1/users/password) ---
// Accepts: { oldPassword, newPassword }
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const res = await axios.put(
        `${API}/users/password`,
        { oldPassword, newPassword },
        authHeader()
      );
      return res.data;
    },
  });
}

// --- UPDATE EMPLOYER PROFILE (PUT /api/v1/employer/me) ---
export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      // EmployerRequestDto: { companyName, companySize, description }
      const res = await axios.put(`${API}/employer/me`, profileData, authHeader());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "profile"] });
    },
  });
}

// --- COMPANY PROFILE (legacy - kept for backward compat) ---
export function useCompanyProfile() {
  return useEmployerProfile();
}

// --- INTERVIEWS — uses shared /employer/all-applications ---
export function useInterviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ["employer", "interviews", page],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/all-applications`, authHeader());
      const allApps = Array.isArray(res.data) ? res.data : [];
      const interviewApps = allApps.filter((a) => a.status === "INTERVIEW");

      // Client-side pagination
      const start = page * size;
      return {
        content: interviewApps.slice(start, start + size),
        totalElements: interviewApps.length,
        totalPages: Math.ceil(interviewApps.length / size),
      };
    },
    staleTime: 1000 * 60 * 1,
    placeholderData: (prev) => prev,
    retry: 1,
  });
}

// --- UPDATE COMPANY PROFILE (legacy alias) ---
export function useUpdateCompanyProfile() {
  return useUpdateEmployerProfile();
}

// --- UPDATE APPLICATION STATUS (PATCH /api/v1/applications/{id}/status?status=...) ---
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axios.patch(
        `${API}/applications/${id}/status?status=${status}`,
        {},
        authHeader()
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
    },
  });
}

// --- UPDATE JOB STATUS (PATCH /api/v1/jobs/{id}/status?status=...) ---
export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axios.patch(
        `${API}/jobs/${id}/status?status=${status}`,
        {},
        authHeader()
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// --- DELETE JOB (DELETE /api/v1/jobs/{id}) ---
export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`${API}/jobs/${id}`, authHeader());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}