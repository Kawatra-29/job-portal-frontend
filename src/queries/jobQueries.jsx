import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

// --- FETCH JOBS ---
export function useJobs(page = 0, size = 10) {
    return useQuery({
        queryKey: ["jobs", "list", page],
        queryFn: async () => {
            const res = await apiClient.get(`/jobs?page=${page}&size=${size}`);
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
        placeholderData: (prev) => prev,
    });
}

// --- FETCH SINGLE JOB ---
export function useJob(jobId) {
    return useQuery({
        queryKey: ["jobs", "detail", jobId],
        queryFn: async () => {
            const res = await apiClient.get(`/jobs/${jobId}`);
            return res.data;
        },
        enabled: !!jobId,
    });
}

// --- POST JOB ---
export function usePostJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobData) => {
            const res = await apiClient.post("/jobs", jobData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
}

// --- USER PROFILE ---
export function useUserProfile() {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => {
            const res = await apiClient.get("/users/me");
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
}
