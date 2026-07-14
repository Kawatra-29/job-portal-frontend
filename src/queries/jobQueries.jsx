import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = "http://localhost:8080/api/v1";
const getToken = () => localStorage.getItem("token");

// --- FETCH JOBS ---
export function useJobs(page = 0, size = 10) {
    return useQuery({
        queryKey: ["jobs", "list", page],
        queryFn: async () => {
            const res = await axios.get(`${API}/jobs?page=${page}&size=${size}`);
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
            const res = await axios.get(`${API}/jobs/${jobId}`);
            return res.data;
        },
        enabled: !!jobId, // ← jobId exist kare tabhi fetch karo
    });
}

// --- POST JOB ---
export function usePostJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobData) => {
            const res = await axios.post(`${API}/jobs`, jobData, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
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
            const res = await axios.get(`${API}/users/me`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 min cache for profile
    });
}
