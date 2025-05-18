"use client";

import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import SearchForm from "./components/SearchForm";
import ResultsTable from "./components/ResultsTable";
import { useApi } from "./hooks/useApi";

export default function Home() {
  const [logs, setLogs] = useState("[ui] Listening for sidecar & network logs...");
  const [results, setResults] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const { search } = useApi();

  const performSearch = async (keyword: string) => {
    if (!keyword) {
      setLogs((prev) => prev + "\n[ui] Please enter a keyword to search.");
      return;
    }
    try {
      const res = await search(keyword);
      if (res?.results) {
        setResults(res.results);
        setLogs((prev) => prev + `\n[ui] Found ${res.results.length} matching rows.`);
      }
    } catch (err) {
      setLogs((prev) => prev + `\n[ui] ${err}`);
    }
  };

  const initSidecarListeners = async () => {
    const unlistenStdout = await listen("sidecar-stdout", (event) => {
      if (`${event.payload}`.length > 0 && event.payload !== "\r\n") {
        setLogs((prev) => prev + `\n${event.payload}`);
      }
    });
    const unlistenStderr = await listen("sidecar-stderr", (event) => {
      if (`${event.payload}`.length > 0 && event.payload !== "\r\n") {
        setLogs((prev) => prev + `\n${event.payload}`);
      }
    });
    return () => {
      unlistenStdout();
      unlistenStderr();
    };
  };

  useEffect(() => {
    initSidecarListeners();
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "F11") {
        event.preventDefault();
        invoke("toggle_fullscreen");
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8008/api/health");
        if (res.ok) {
          setIsConnecting(false);
          setLogs((prev) => prev + "\n[ui] Backend connected successfully.");
          clearInterval(intervalId);
        }
      } catch {
        setLogs((prev) => prev + "\n[ui] Waiting for backend to connect...");
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {isConnecting ? (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-6"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
        </main>
      ) : (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-200">
          <header className="w-full mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Redash Search App</h1>
          </header>
          <SearchForm onSearch={performSearch} />
          <ResultsTable results={results} />
        </main>
      )}
    </>
  );
}

