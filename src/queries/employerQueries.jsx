import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

// --- BASE QUERY: Single call to GET /employer/all-applications ---
function useAllEmployerApplications(options = {}) {
  return useQuery({
    queryKey: ["employer", "all-applications"],
    queryFn: async () => {
      const res = await apiClient.get("/employer/all-applications");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
    ...options,
  });
}

// --- EMPLOYER STATS (derived from single /employer/all-applications call) ---
export function useEmployerStats() {
  const jobsQuery = useQuery({
    queryKey: ["employer", "jobs", "active"],
    queryFn: async () => {
      const res = await apiClient.get("/employer/jobs");
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

// --- RECENT APPLICANTS ---
export function useRecentApplicants(limit = 5) {
  return useAllEmployerApplications({
    select: (apps) =>
      [...apps]
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, limit),
  });
}

// --- ACTIVE JOBS ---
export function useActiveJobs() {
  return useQuery({
    queryKey: ["employer", "jobs", "active"],
    queryFn: async () => {
      const res = await apiClient.get("/employer/jobs");
      const jobs = res.data || [];
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

// --- ALL APPLICANTS ---
export function useAllApplicants(page = 0, size = 10, filters = {}) {
  return useQuery({
    queryKey: ["employer", "applicants", "all", page, size, filters],
    queryFn: async () => {
      const res = await apiClient.get("/employer/all-applications");
      const allApps = Array.isArray(res.data) ? res.data : [];

      let filtered = allApps;
      if (filters.status) {
        filtered = filtered.filter((a) => a.status === filters.status);
      }

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
      const res = await apiClient.get(`/employer/jobs?page=${page}&size=${size}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
    retry: 1,
  });
}

// --- SINGLE JOB DETAIL ---
export function useEmployerJob(jobId) {
  return useQuery({
    queryKey: ["employer", "jobs", "detail", jobId],
    queryFn: async () => {
      const res = await apiClient.get(`/jobs/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

// --- EMPLOYER PROFILE ---
export function useEmployerProfile() {
  return useQuery({
    queryKey: ["employer", "profile"],
    queryFn: async () => {
      const res = await apiClient.get("/employer/me");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// --- USER INFO ---
export function useUserMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// --- UPDATE USER PERSONAL INFO ---
export function useUpdateUserMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await apiClient.put("/users/me", userData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

// --- UPDATE PASSWORD ---
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const res = await apiClient.put("/users/password", { oldPassword, newPassword });
      return res.data;
    },
  });
}

// --- UPDATE EMPLOYER PROFILE ---
export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const res = await apiClient.put("/employer/me", profileData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "profile"] });
    },
  });
}

// --- COMPANY PROFILE ALIAS ---
export function useCompanyProfile() {
  return useEmployerProfile();
}

// --- INTERVIEWS ---
export function useInterviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ["employer", "interviews", page],
    queryFn: async () => {
      const res = await apiClient.get("/employer/all-applications");
      const allApps = Array.isArray(res.data) ? res.data : [];
      const interviewApps = allApps.filter((a) => a.status === "INTERVIEW");

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

// --- UPDATE COMPANY PROFILE ALIAS ---
export function useUpdateCompanyProfile() {
  return useUpdateEmployerProfile();
}

// --- UPDATE APPLICATION STATUS ---
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.patch(`/applications/${id}/status?status=${status}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
    },
  });
}

// --- UPDATE JOB STATUS ---
export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.patch(`/jobs/${id}/status?status=${status}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// --- DELETE JOB ---
export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/jobs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}