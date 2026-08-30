// The API client — currently delegates to mock adapter.
// When backend is ready, replace mockAdapter calls with fetch() calls here.
// UI code never changes.

export { mockAdapter as apiClient } from './mock-adapter'
