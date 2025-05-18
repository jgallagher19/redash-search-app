"use client";
import { useCallback } from "react";

const DOMAIN = "localhost";
const PORT = "8008";

export function useApi() {
  const apiAction = useCallback(
    async (endpoint: string, method = "GET", payload?: any) => {
      const url = `http://${DOMAIN}:${PORT}/${endpoint}`;
      const body = payload ? JSON.stringify(payload) : null;
      const headers = { "Content-Type": "application/json" };
      const res = await fetch(url, { method, headers, body });
      if (!res.ok) throw new Error(`Response status: ${res.status}`);
      return res.json();
    },
    []
  );

  const search = useCallback(
    (keyword: string) => apiAction(`api/search?keyword=${encodeURIComponent(keyword)}`),
    [apiAction]
  );

  return { apiAction, search };
}
