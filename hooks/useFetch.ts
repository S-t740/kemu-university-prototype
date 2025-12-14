import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useFetch<T>(url: string, dependencies: any[] = []): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    // Add a trigger state to force refetch even if url/deps don't change
    const [trigger, setTrigger] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(url);
            setData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred loading data'));
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData, trigger, ...dependencies]);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    return { data, loading, error, refetch };
}
