import { describe, it, expect } from 'vitest';
import { version } from './index';

describe('UI Package Exports', () => {
  it('should export version', () => {
    expect(version).toBe('0.1.0-experimental');
  });
});
