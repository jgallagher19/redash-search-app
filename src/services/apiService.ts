// src/services/apiService.ts

const API_BASE = "http://localhost:8008";

/**
 * Performs a search by calling the backend API.
 * @param keyword The search keyword.
 * @returns A promise that resolves with the JSON response.
 */
export async function searchCSV(keyword: string): Promise<any> {
    const url = `${API_BASE}/api/search?keyword=${encodeURIComponent(keyword)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in searchCSV:", error);
        throw error;
    }
}