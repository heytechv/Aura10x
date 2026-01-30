import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPublicPerfumes } from './perfume.service';

describe('PerfumeService', () => {
  let mockSupabase: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    // Setup a chainable mock builder
    mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      // Mock 'then' to simulate Promise/await behavior
      then: vi.fn(), 
    };

    mockSupabase = {
      from: vi.fn().mockReturnValue(mockQueryBuilder),
    };
  });

  const setupSuccessResponse = (data: any[], count: number) => {
    mockQueryBuilder.then.mockImplementation((resolve: any) => {
      return Promise.resolve({ data, error: null, count }).then(resolve);
    });
  };

  const setupErrorResponse = (message: string) => {
    mockQueryBuilder.then.mockImplementation((resolve: any) => {
      return Promise.resolve({ data: null, error: { message }, count: null }).then(resolve);
    });
  };

  describe('getPublicPerfumes', () => {
    it('should select correct columns including nested brand', async () => {
      setupSuccessResponse([], 0);
      const params = { limit: 10, page: 1 };
      
      await getPublicPerfumes(mockSupabase, params);

      expect(mockSupabase.from).toHaveBeenCalledWith('perfumes');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        expect.stringContaining('brand:brands'),
        { count: 'exact' }
      );
    });

    it('should calculate correct range for pagination (page 1)', async () => {
      const mockData = [
        { id: 1, name: 'Perfume 1' },
        { id: 2, name: 'Perfume 2' },
      ];
      const mockCount = 10;
      setupSuccessResponse(mockData, mockCount);

      const params = { limit: 10, page: 1 };
      const result = await getPublicPerfumes(mockSupabase, params);

      // page 1, limit 10 => from 0, to 9
      expect(mockQueryBuilder.range).toHaveBeenCalledWith(0, 9);
      
      expect(result.perfumes).toEqual(mockData);
      expect(result.totalItems).toEqual(mockCount);
    });

    it('should calculate correct range for pagination (page 2)', async () => {
      setupSuccessResponse([], 10);

      const params = { limit: 10, page: 2 };
      await getPublicPerfumes(mockSupabase, params);

      // page 2, limit 10 => from 10, to 19
      expect(mockQueryBuilder.range).toHaveBeenCalledWith(10, 19);
    });

    it('should apply ilike filter when query is provided', async () => {
      const query = 'Chanel';
      setupSuccessResponse([], 0);

      const params = { limit: 10, page: 1, query };
      await getPublicPerfumes(mockSupabase, params);

      expect(mockQueryBuilder.ilike).toHaveBeenCalledWith('name', `%${query}%`);
    });

    it('should not apply ilike filter when query is empty', async () => {
      setupSuccessResponse([], 0);

      const params = { limit: 10, page: 1 }; // no query
      await getPublicPerfumes(mockSupabase, params);

      expect(mockQueryBuilder.ilike).not.toHaveBeenCalled();
    });

    it('should throw an error when Supabase returns an error', async () => {
      const errorMessage = 'Database connection failed';
      setupErrorResponse(errorMessage);

      const params = { limit: 10, page: 1 };
      
      await expect(getPublicPerfumes(mockSupabase, params)).rejects.toThrow(errorMessage);
    });

    it('should default totalItems to 0 if count is null', async () => {
        // Force count to be undefined/null
        mockQueryBuilder.then.mockImplementation((resolve: any) => {
            return Promise.resolve({ data: [], error: null, count: null }).then(resolve);
        });

        const result = await getPublicPerfumes(mockSupabase, { limit: 10, page: 1 });
        expect(result.totalItems).toBe(0);
    });
  });
});
