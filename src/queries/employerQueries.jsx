import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = "http://localhost:8080/api/v1";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// --- EMPLOYER STATS (derived from GET /employer/jobs + applications) ---
export function useEmployerStats() {
  return useQuery({
    queryKey: ["employer", "stats"],
    queryFn: async () => {
      // Fetch all employer jobs
      const jobsRes = await axios.get(`${API}/employer/jobs`, authHeader());
      const jobs = jobsRes.data || [];
      const activeJobs = jobs.filter((j) => j.status === "OPEN");

      // Fetch applications for all jobs in parallel to get totals
      const appResults = await Promise.all(
        jobs.map((job) =>
          axios
            .get(`${API}/employer/jobs/${job.id}/applications`, authHeader())
            .then((r) => r.data || [])
            .catch(() => [])
        )
      );
      const allApps = appResults.flat();
      const shortlisted = allApps.filter(
        (a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW" || a.status === "HIRED"
      ).length;

      return {
        activeJobPosts: activeJobs.length,
        totalApplicants: allApps.length,
        shortlisted,
        interviewsToday: allApps.filter((a) => a.status === "INTERVIEW").length,
      };
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
  });
}

// --- RECENT APPLICANTS — fetches apps across all jobs (GET /employer/jobs/{id}/applications) ---
export function useRecentApplicants(limit = 5) {
  return useQuery({
    queryKey: ["employer", "applicants", "recent", limit],
    queryFn: async () => {
      const jobsRes = await axios.get(`${API}/employer/jobs`, authHeader());
      const jobs = jobsRes.data || [];
      if (!jobs.length) return [];

      const appResults = await Promise.all(
        jobs.map((job) =>
          axios
            .get(`${API}/employer/jobs/${job.id}/applications`, authHeader())
            .then((r) => (r.data || []).map((app) => ({ ...app, _jobTitle: job.title })))
            .catch(() => [])
        )
      );

      return appResults
        .flat()
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, limit);
    },
    staleTime: 1000 * 60 * 1,
    retry: 1,
  });
}

// --- ACTIVE JOBS — uses real endpoint GET /employer/jobs ---
export function useActiveJobs() {
  return useQuery({
    queryKey: ["employer", "jobs", "active"],
    queryFn: async () => {
      const res = await axios.get(`${API}/employer/jobs`, authHeader());
      // Show all jobs; OPEN ones first
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

// --- ALL APPLICANTS (dedicated page) ---
export function useAllApplicants(page = 0, size = 10, filters = {}) {
  return useQuery({
    queryKey: ["employer", "applicants", "all", page, size, filters],
    queryFn: async () => {
      // Fetch all employer jobs
      const jobsRes = await axios.get(`${API}/employer/jobs`, authHeader());
      const jobs = jobsRes.data || [];
      if (!jobs.length) return { content: [], totalElements: 0, totalPages: 0 };

      // Fetch applications for all jobs in parallel
      const appResults = await Promise.all(
        jobs.map((job) =>
          axios
            .get(`${API}/employer/jobs/${job.id}/applications`, authHeader())
            .then((r) => (r.data || []).map((app) => ({ ...app, _jobTitle: job.title })))
            .catch(() => [])
        )
      );

      const allApps = appResults.flat();
      
      // Apply filters if any
      let filteredApps = allApps;
      if (filters.status) {
        filteredApps = filteredApps.filter(a => a.status === filters.status);
      }
      
      // Paginate
      const start = page * size;
      const paginatedApps = filteredApps.slice(start, start + size);
      
      return {
        content: paginatedApps,
        totalElements: filteredApps.length,
        totalPages: Math.ceil(filteredApps.length / size)
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

// --- INTERVIEWS ---
export function useInterviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ["employer", "interviews", page],
    queryFn: async () => {
      // Fetch all employer jobs
      const jobsRes = await axios.get(`${API}/employer/jobs`, authHeader());
      const jobs = jobsRes.data || [];
      if (!jobs.length) return { content: [], totalElements: 0, totalPages: 0 };

      // Fetch applications for all jobs in parallel
      const appResults = await Promise.all(
        jobs.map((job) =>
          axios
            .get(`${API}/employer/jobs/${job.id}/applications`, authHeader())
            .then((r) => (r.data || []).map((app) => ({ ...app, _jobTitle: job.title })))
            .catch(() => [])
        )
      );

      const allApps = appResults.flat();
      const interviewApps = allApps.filter(a => a.status === "INTERVIEW");

      // Paginate
      const start = page * size;
      const paginatedApps = interviewApps.slice(start, start + size);

      return {
        content: paginatedApps,
        totalElements: interviewApps.length,
        totalPages: Math.ceil(interviewApps.length / size)
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