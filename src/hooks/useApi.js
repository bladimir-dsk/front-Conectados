import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";

export function useApi(endpoint, options, autoFetch = true) {
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

    return { data, loading, error, fetchData, postData, patchData, deleteData };
}