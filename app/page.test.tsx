// app/page.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure Jest DOM is available
import Page from './page'; // Adjust the path if needed
import { searchCSV } from '../src/services/apiService';

// Mock the API service so that our tests don't make real network requests
jest.mock('../src/services/apiService');
const mockedSearchCSV = searchCSV as jest.Mock;

describe("Page Component Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("displays search results when search is successful", async () => {
        // Arrange: mock the API call to return results
        const mockResults = {
            results: [
                { login: 'test@example.com', name: 'Test User' },
                { login: 'user2@example.com', name: 'Another User' },
            ]
        };
        mockedSearchCSV.mockResolvedValueOnce(mockResults);

        // Act: render the component and simulate user interactions
        render(<Page />);

        // Assume your search input has a placeholder "Enter keyword"
        const input = screen.getByPlaceholderText("Enter keyword");
        fireEvent.change(input, { target: { value: "test" } });

        const searchButton = screen.getByText("Search CSV");
        fireEvent.click(searchButton);

        // Assert: wait for search results to be rendered
        await waitFor(() => {
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
            expect(screen.getByText(/test@example\.com/i)).toBeInTheDocument();
        });
    });

    it("displays error message when search fails", async () => {
        // Arrange: mock the API call to reject with an error
        mockedSearchCSV.mockRejectedValueOnce(new Error("Search failed"));

        // Act: render the component and simulate a failed search
        render(<Page />);

        const input = screen.getByPlaceholderText("Enter keyword");
        fireEvent.change(input, { target: { value: "fail" } });

        const searchButton = screen.getByText("Search CSV");
        fireEvent.click(searchButton);

        // Assert: wait for the error message to appear
        await waitFor(() => {
            expect(screen.getByText(/Search failed/i)).toBeInTheDocument();
        });
    });
});