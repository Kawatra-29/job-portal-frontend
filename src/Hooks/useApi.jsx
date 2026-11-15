import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../api/apiClient";

export default function useApi(initialUrl = "", initialMethod = "GET") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialMethod === "GET" && !!initialUrl);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const request = useCallback(async (url, method = "GET", body = null, headers = {}, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient({
        url,
        method,
        data: body,
        headers,
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
  const patch = useCallback((url, body, headers = {}, options = {}) => request(url, "PATCH", body, headers, options), [request]);
  const del = useCallback((url, headers = {}, options = {}) => request(url, "DELETE", null, headers, options), [request]);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
  };
}