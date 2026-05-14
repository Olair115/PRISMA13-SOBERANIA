import { useCallback, useEffect, useMemo, useState } from "react";
import { createHealthDataClient } from "@prisma13/integrations";

export function useHealthData({ getIdToken, enabled = true, baseUrl = import.meta.env.VITE_API_BASE_URL || "" }) {
  const client = useMemo(() => {
    if (!getIdToken) return null;
    return createHealthDataClient({ baseUrl, getIdToken });
  }, [baseUrl, getIdToken]);
  const [state, setState] = useState({
    loading: Boolean(enabled && client),
    data: null,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!client || !enabled) return null;

    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await client.getHealthData();
      setState({ loading: false, data, error: null });
      return data;
    } catch (error) {
      setState({ loading: false, data: null, error });
      return null;
    }
  }, [client, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    client,
    refresh,
  };
}
