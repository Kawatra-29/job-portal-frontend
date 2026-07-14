import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function useApi(initialUrl = "", initialMethod = "GET") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialMethod === "GET" && !!initialUrl);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const res = await axios({
        url,
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

  const get = useCallback((url) => request(url, "GET"), [request]);
  const post = useCallback((url, body) => request(url, "POST", body), [request]);
  const put = useCallback((url, body) => request(url, "PUT", body), [request]);
  const del = useCallback((url) => request(url, "DELETE"), [request]);

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