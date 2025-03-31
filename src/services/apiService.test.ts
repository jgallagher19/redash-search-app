// src/services/apiService.test.ts
import { searchCSV } from "./apiService";

// Mock the global fetch function
global.fetch = jest.fn();

describe("searchCSV", () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();
    });

    it("should fetch and return CSV search results", async () => {
        const mockResponse = {
            results: [
                { login: "test@example.com", name: "Test User" },
                { login: "user2@example.com", name: "Another User" },
            ],
        };

        // Mock a successful fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await searchCSV("test");

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockResponse);
    });

    it("should throw an error if fetch fails", async () => {
        // Mock a failed fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: "Not Found",
        });

        await expect(searchCSV("test")).rejects.toThrow("API error: Not Found");
    });
});