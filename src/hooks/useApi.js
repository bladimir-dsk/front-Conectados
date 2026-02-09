import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";

export function useApi(endpoint, options, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  const hasFetchedRef = useRef(false);

  // Actualizar ref solo cuando cambien las opciones
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // GET - estable sin dependencias externas
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint, optionsRef.current);
      setData(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint]); // Solo depende de endpoint

  // Función helper para preparar config según el tipo de body
  const prepareConfig = (body) => {
    const baseConfig = { ...optionsRef.current };

    // Si es FormData, NO establecer Content-Type (Axios lo hace automáticamente)
    if (body instanceof FormData) {
      // Eliminar Content-Type si existe para que Axios lo configure correctamente
      if (baseConfig.headers) {
        const { "Content-Type": _, ...restHeaders } = baseConfig.headers;
        baseConfig.headers = restHeaders;
      }
      // Axios detectará automáticamente FormData y establecerá:
      // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
    }

    return baseConfig;
  };

  // POST
  const postData = useCallback(
    async (body, shouldRefetch = true) => {
      setLoading(true);
      setError(null);
      try {
        const config = prepareConfig(body);
        const response = await api.post(endpoint, body, config);

        // Solo hacer fetchData si es necesario
        if (shouldRefetch && autoFetch) {
          await fetchData();
        }
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const optionsRef = useRef(options);
    const hasFetchedRef = useRef(false);

    // 🔹 NUEVO: Extraer endpoint base sin query params
    const getBaseEndpoint = useCallback(() => {
        return endpoint.split('?')[0]; // /propietarios?params → /propietarios
    }, [endpoint]);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(endpoint, optionsRef.current);
            setData(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    const postData = useCallback(async (body, shouldRefetch = true) => {
        setLoading(true);
        setError(null);
        try {
            const baseEndpoint = getBaseEndpoint(); // 👈 Usar endpoint base
            const response = await api.post(baseEndpoint, body, optionsRef.current);

            if (shouldRefetch && autoFetch) {
                await fetchData();
            }

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error en POST";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getBaseEndpoint, fetchData, autoFetch]);

    const patchData = useCallback(
        async (body, id = null) => {
            setLoading(true);
            setError(null);
            try {
                const baseEndpoint = getBaseEndpoint(); // 👈 Usar endpoint base
                const url = id ? `${baseEndpoint}/${id}` : baseEndpoint;

                const response = await api.patch(url, body, optionsRef.current);
                await fetchData();
                return response.data;
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || "Error en PATCH";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [getBaseEndpoint, fetchData]
    );

    // 🔹 ACTUALIZADO: DELETE usa endpoint base limpio
    const deleteData = useCallback(
        async (id) => {
            setLoading(true);
            setError(null);
            try {
                const baseEndpoint = getBaseEndpoint(); // 👈 /propietarios (sin params)
                const response = await api.delete(`${baseEndpoint}/${id}`, optionsRef.current);

                await fetchData(); // Recargar con filtros originales
                return response.data;
            } catch (err) {
                const errorMessage = err.response?.data?.message
                    || err.response?.data?.error
                    || err.message
                    || "Error al eliminar";

                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [getBaseEndpoint, fetchData]
    );

    useEffect(() => {
        if (autoFetch && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchData();
        }
    }, [autoFetch, endpoint]);

    useEffect(() => {
        hasFetchedRef.current = false;
    }, [endpoint]);

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Error en POST";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, fetchData, autoFetch],
  );

  const patchData = useCallback(
    async (body, id = null) => {
      setLoading(true);
      setError(null);
      try {
        const url = id ? `${endpoint}/${id}` : endpoint;
        const config = prepareConfig(body);

        const response = await api.patch(url, body, config);

        // Recargar datos después de actualizar
        await fetchData();
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Error en PATCH";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, fetchData],
  );

  // DELETE
  const deleteData = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.delete(
          `${endpoint}/${id}`,
          optionsRef.current,
        );

        // Recargar datos después de eliminar
        await fetchData();
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Error al eliminar";

        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, fetchData],
  );

  useEffect(() => {
    // Solo ejecutar si autoFetch está activo y no se ha ejecutado antes
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, [autoFetch, endpoint]); // Removido fetchData de las dependencias

  // Resetear el flag cuando cambie el endpoint
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [endpoint]);

  return { data, loading, error, fetchData, postData, patchData, deleteData };
}
