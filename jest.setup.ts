import '@testing-library/jest-dom';

// Mock Tauri's API so that tests don't fail because of missing Tauri globals
jest.mock('@tauri-apps/api/core', () => ({
    transformCallback: jest.fn((callback, once) => callback),
}));

jest.mock('@tauri-apps/api/event', () => ({
    listen: jest.fn().mockResolvedValue(() => Promise.resolve()),
}));
