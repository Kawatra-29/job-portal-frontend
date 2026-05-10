import { useState, useEffect, useCallback } from "react";

export default function useApi(initialUrl = "", initialMethod = "GET") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialMethod === "GET" && !!initialUrl);
  const [error, setError] = useState(null);

  // 🔥 COMMON REQUEST FUNCTION
  const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const json = res.headers.get("content-length") !== "0" ? await res.json() : null;
      setData(json);

      return json;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 AUTO GET (only when method = GET)
  useEffect(() => {
    if (initialMethod === "GET" && initialUrl) {
      request(initialUrl, "GET");
    }
  }, [initialUrl, initialMethod, request]);

  // 🔥 METHODS
  const get = (url) => request(url, "GET");

  const post = (url, body) => request(url, "POST", body);

  const put = (url, body) => request(url, "PUT", body);

  const del = (url) => request(url, "DELETE");

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del,
  };
}