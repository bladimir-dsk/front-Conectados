import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";

export function useApi(endpoint, options = {}, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const getBaseEndpoint = useCallback(() => {
    return endpoint.split("?")[0];
  }, [endpoint]);

  const prepareConfig = (body) => {
    const config = { ...optionsRef.current };

    if (body instanceof FormData && config.headers) {
      const { "Content-Type": _, ...rest } = config.headers;
      config.headers = rest;
    }

    return config;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoint, optionsRef.current);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const postData = useCallback(
    async (body, shouldRefetch = true) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post(
          getBaseEndpoint(),
          body,
          prepareConfig(body),
        );

        if (shouldRefetch && autoFetch) {
          await fetchData();
        }

        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBaseEndpoint, fetchData, autoFetch],
  );

  const patchData = useCallback(
    async (body, id) => {
      setLoading(true);
      setError(null);
      try {
        const url = `${getBaseEndpoint()}/${id}`;
        const res = await api.patch(url, body, prepareConfig(body));
        await fetchData();
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBaseEndpoint, fetchData],
  );

  const deleteData = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.delete(
          `${getBaseEndpoint()}/${id}`,
          optionsRef.current,
        );
        await fetchData();
        return res.data;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBaseEndpoint, fetchData],
  );

  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, [autoFetch, fetchData]);

  useEffect(() => {
    hasFetchedRef.current = false;
  }, [endpoint]);

  return { data, loading, error, fetchData, postData, patchData, deleteData };
}
