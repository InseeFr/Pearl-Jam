import { vi } from 'vitest';

export default {
  getQueenVersion: vi.fn(() => 'Queen : v 1.2.3'),
  getArticulationTable: vi.fn(() => Promise.resolve(null)),
  partialResetInterrogation: vi.fn(() => Promise.resolve()),
};
