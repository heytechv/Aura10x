import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge classes correctly', () => {
      expect(cn('c-1', 'c-2')).toBe('c-1 c-2');
    });

    it('should handle conditional classes', () => {
      expect(cn('c-1', false && 'c-2', 'c-3')).toBe('c-1 c-3');
    });

    it('should merge tailwind classes', () => {
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });
  });
});
