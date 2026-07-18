import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export default function useApi(initialUrl = "", initialMethod = "GET") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialMethod === "GET" && !!initialUrl);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const request = useCallback(async (url, method = "GET", body = null, headers = {}, options = {}) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    const finalUrl = url.startsWith("http")
      ? url
      : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

    try {
      const res = await axios({
        url: finalUrl,
        method,
        data: body,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
          ...headers,
        },
      });

      setData(res.data);
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/auth");
      }
      if (err.response?.data) {
        setError(err.response.data.message || err.message);
      } else {
        setError(err.message);
      }
      if (options.throwError) {
        throw err;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    let active = true;
    if (initialMethod === "GET" && initialUrl) {
      Promise.resolve().then(() => {
        if (active) {
          request(initialUrl, "GET");
        }
      });
    }
    return () => {
      active = false;
    };
  }, [initialUrl, initialMethod, request]);

  const get = useCallback((url, headers = {}, options = {}) => request(url, "GET", null, headers, options), [request]);
  const post = useCallback((url, body, headers = {}, options = {}) => request(url, "POST", body, headers, options), [request]);
  const put = useCallback((url, body, headers = {}, options = {}) => request(url, "PUT", body, headers, options), [request]);
  const del = useCallback((url, headers = {}, options = {}) => request(url, "DELETE", null, headers, options), [request]);

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