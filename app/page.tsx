"use client";

import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { searchCSV } from "../src/services/apiService";

/**
 * Splits a text string by the keyword and wraps matching parts with a highlight span.
 * @param text The full text to process.
 * @param keyword The search keyword.
 * @returns JSX with the keyword parts highlighted.
 */
function highlightText(text: string, keyword: string): JSX.Element {
  if (!keyword) return <>{text}</>;
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className="bg-yellow-300 font-bold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export default function Home() {
  const DOMAIN = "localhost";
  const PORT = "8008";

  const [logs, setLogs] = useState("[ui] Listening for sidecar & network logs...");
  const [keyword, setKeyword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 40;
  const [isConnecting, setIsConnecting] = useState(true);

  // Track which cell is expanded (row + column).
  const [expandedCell, setExpandedCell] = useState<{
    rowIndex: number;
    colKey: string;
  } | null>(null);

  // ----------------------------
  // Sidecar listeners
  // ----------------------------
  const initSidecarListeners = async () => {
    const unlistenStdout = await listen("sidecar-stdout", (event) => {
      console.log("Sidecar stdout:", event.payload);
      if (`${event.payload}`.length > 0 && event.payload !== "\r\n") {
        setLogs((prev) => prev + `\n${event.payload}`);
      }
    });
    const unlistenStderr = await listen("sidecar-stderr", (event) => {
      console.error("Sidecar stderr:", event.payload);
      if (`${event.payload}`.length > 0 && event.payload !== "\r\n") {
        setLogs((prev) => prev + `\n${event.payload}`);
      }
    });
    return () => {
      unlistenStdout();
      unlistenStderr();
    };
  };

  // ----------------------------
  // Simple fetch helper
  // ----------------------------
  const apiAction = async (
    endpoint: string,
    method: string = "GET",
    payload?: any
  ) => {
    const url = `http://${DOMAIN}:${PORT}/${endpoint}`;
    try {
      const body = payload ? JSON.stringify(payload) : null;
      const headers = { "Content-Type": "application/json" };
      const res = await fetch(url, { method, headers, body });
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      const json = await res.json();
      console.log(json);

      // Log success message from server
      if (json?.message) {
        setLogs((prev) => prev + `\n[server-response] ${json.message}`);
      }
      return json;
    } catch (err) {
      console.error(`[server-response] ${err}`);
      setLogs((prev) => prev + `\n[server-response] ${err}`);
    }
  };

  // ----------------------------
  // Perform a search
  // ----------------------------
  const performSearch = async () => {
    if (!keyword) {
      setLogs((prev) => prev + "\n[ui] Please enter a keyword to search.");
      return;
    }
    try {
      // Clear any previous error message when starting a new search
      setErrorMessage("");
      const result = await searchCSV(keyword);
      if (result?.results) {
        setSearchResults(result.results);
        setLogs((prev) => prev + `\n[ui] Found ${result.results.length} matching rows.`);
        setExpandedCell(null); // Reset any expanded cell when new data arrives.
      }
    } catch (error) {
      console.error("[server-response]", error);
      setLogs((prev) => prev + `\n[server-response] Error: ${error}`);
      setErrorMessage("Search failed. Please try again later.");
    }
  };

  // ----------------------------
  // Toggle cell expansion
  // ----------------------------
  const toggleCellExpand = (rowIndex: number, colKey: string) => {
    if (expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.colKey === colKey) {
      setExpandedCell(null); // collapse if same cell clicked again
    } else {
      setExpandedCell({ rowIndex, colKey });
    }
  };

  // ----------------------------
  // Lifecycle Hooks
  // ----------------------------
  useEffect(() => {
    initSidecarListeners();
  }, []);

  // Handle F11 for fullscreen
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

  // Health check polling
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`http://${DOMAIN}:${PORT}/api/health`);
        if (res.ok) {
          setIsConnecting(false);
          setLogs((prev) => prev + "\n[ui] Backend connected successfully.");
          clearInterval(intervalId);
        }
      } catch (err) {
        setLogs((prev) => prev + "\n[ui] Waiting for backend to connect...");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // ----------------------------
  // Styles for truncated vs. expanded
  // ----------------------------
  const truncateCellClasses =
    "inline-block overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer max-w-[120px] align-top";
  const expandedCellClasses =
    "inline-block whitespace-normal break-words bg-yellow-100 p-1 rounded cursor-pointer align-top";

  return (
    <>
      {isConnecting ? (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-6"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
        </main>
      ) : (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-200">
          {/* Header */}
          <header className="w-full mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Redash Search App</h1>
          </header>

          {/* Search Input & Button */}
          <div className="w-full max-w-xl mb-6">
            <input
              type="text"
              placeholder="Search keyword..."
              className="border p-2 rounded w-full bg-white text-black"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  performSearch();
                }
              }}
            />
            <button
              onClick={performSearch}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Search CSV
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center bg-red-200 text-red-800 p-2 rounded mb-4">
              <span className="mr-2">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}


          {/* Paginated Search Results */}
          {(() => {
            const startIndex = currentPage * itemsPerPage;
            const paginatedResults = searchResults.slice(startIndex, startIndex + itemsPerPage);
            return (
              <>
                <div className="w-full max-w-5xl rounded-lg bg-white shadow-md p-4 border border-gray-300">
                  <h3 className="font-bold mb-2 text-gray-900">Search Results:</h3>
                  {paginatedResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="border-collapse w-full text-left text-sm text-gray-800">
                        <thead>
                          <tr>
                            {Object.keys(paginatedResults[0]).map((colKey) => (
                              <th key={colKey} className="border-b border-gray-200 px-2 py-2 bg-gray-100 font-bold">
                                {colKey}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedResults.map((row, index) => {
                            const originalRowIndex = currentPage * itemsPerPage + index;
                            return (
                              <tr key={originalRowIndex}>
                                {Object.keys(row).map((colKey) => {
                                  const cellValue = String(row[colKey]);
                                  const isExpanded =
                                    expandedCell &&
                                    expandedCell.rowIndex === originalRowIndex &&
                                    expandedCell.colKey === colKey;
                                  return (
                                    <td
                                      key={colKey}
                                      className="border-b border-gray-200 px-2 py-2 align-top"
                                      onClick={() => toggleCellExpand(originalRowIndex, colKey)}
                                    >
                                      {isExpanded ? (
                                        <div className={expandedCellClasses}>
                                          {highlightText(cellValue, keyword)}
                                        </div>
                                      ) : (
                                        <div className={truncateCellClasses}>
                                          {highlightText(cellValue, keyword)}
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="italic text-gray-700">No results yet.</p>
                  )}
                </div>

                {/* Pagination Controls */}
                {searchResults.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 w-full max-w-5xl">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={`px-4 py-2 rounded ${currentPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage + 1} of {Math.ceil(searchResults.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={(currentPage + 1) * itemsPerPage >= searchResults.length}
                      className={`px-4 py-2 rounded ${(currentPage + 1) * itemsPerPage >= searchResults.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            );
          })()}

          {/* Uncomment below to show logs if desired */}
          {/*
          <code className="mt-6 w-full max-w-[1200px] max-h-96 border border-gray-300 rounded-lg bg-gray-100 p-4 text-sm whitespace-pre-wrap overflow-y-auto">
            {logs}
          </code>
          */}
        </main>
      )}
    </>
  );
}