import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AddPerfumeModal } from './AddPerfumeModal';
import { usePublicPerfumes } from '@/components/hooks/usePublicPerfumes';

// Mock the hook
vi.mock('@/components/hooks/usePublicPerfumes', () => ({
  usePublicPerfumes: vi.fn(),
}));

// Mock child components to isolate the test
vi.mock('@/components/shared/SkeletonCard', () => ({
  SkeletonCard: () => <div data-testid="skeleton-card">Skeleton</div>
}));

vi.mock('@/components/shared/PerfumeCard', () => ({
  PerfumeCard: ({ perfume, onAdd, isProcessing, isDisabled }: any) => (
    <div data-testid="perfume-card">
      <span>{perfume.name}</span>
      <span>{perfume.brand.name}</span>
      <button 
        data-testid={`add-btn-${perfume.id}`}
        onClick={() => onAdd(perfume)}
        disabled={isDisabled || isProcessing}
      >
        Add
      </button>
    </div>
  )
}));

describe('AddPerfumeModal', () => {
  const mockOnClose = vi.fn();
  const mockOnPerfumeAdded = vi.fn();
  const mockSearch = vi.fn();
  const mockLoadMore = vi.fn();
  const mockAddPerfume = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Default mock implementation (Success state with items)
    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: [],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly when open', () => {
    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(screen.getByText('Dodaj perfumy do kolekcji')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Szukaj po nazwie lub marce...')).toBeInTheDocument();
  });

  it('triggers search when input changes (debounced)', () => {
    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    const input = screen.getByPlaceholderText('Szukaj po nazwie lub marce...');
    
    // Simulate typing
    fireEvent.change(input, { target: { value: 'Ch' } });
    fireEvent.change(input, { target: { value: 'Cha' } });
    fireEvent.change(input, { target: { value: 'Chanel' } });

    // Should not have called search yet (except potentially the initial call)
    expect(mockSearch).not.toHaveBeenCalledWith('Chanel');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should have called search with the final value
    // Note: It might be called initially with empty string due to useEffect
    expect(mockSearch).toHaveBeenCalledWith('Chanel');
    // Ensure the last call was with 'Chanel'
    expect(mockSearch).toHaveBeenLastCalledWith('Chanel');
  });

  it('resets search when modal opens', () => {
    const { rerender } = render(
      <AddPerfumeModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(mockSearch).not.toHaveBeenCalled();

    // Open the modal
    rerender(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(mockSearch).toHaveBeenCalledWith('');
  });

  it('displays skeleton cards when loading and no items', () => {
    (usePublicPerfumes as any).mockReturnValue({
      status: 'loading',
      items: [],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons.length).toBe(6);
    expect(screen.queryByText('Błąd ładowania perfum.')).not.toBeInTheDocument();
  });

  it('displays error message on error status', () => {
    (usePublicPerfumes as any).mockReturnValue({
      status: 'error',
      items: [],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(screen.getByText('Błąd ładowania perfum.')).toBeInTheDocument();
  });

  it('displays "No results" when success but no items', () => {
    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: [],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(screen.getByText('Nie znaleziono wyników.')).toBeInTheDocument();
  });

  it('displays items when available', () => {
    const mockItems = [
      { id: '1', name: 'Perfume 1', slug: 'p1', image_path: '', brand: { name: 'Brand 1', slug: 'b1' }, isInCollection: false, isBeingAdded: false }
    ];
    
    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: mockItems,
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(screen.getByText('Perfume 1')).toBeInTheDocument();
    expect(screen.getByText('Brand 1')).toBeInTheDocument();
    expect(screen.getByTestId('perfume-card')).toBeInTheDocument();
  });

  it('calls loadMore when "Load more" button is clicked', () => {
    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: [{ id: '1', name: 'P1', brand: { name: 'B1' } }], // need at least one item
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: true,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    const loadMoreBtn = screen.getByText('Załaduj więcej');
    fireEvent.click(loadMoreBtn);

    expect(mockLoadMore).toHaveBeenCalled();
  });

  it('shows loading indicator when loading more', () => {
    (usePublicPerfumes as any).mockReturnValue({
      status: 'loading',
      items: [{ id: '1', name: 'P1', brand: { name: 'B1' } }],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: true,
      addPerfume: mockAddPerfume,
    });

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    expect(screen.getByText('Ładowanie więcej...')).toBeInTheDocument();
    // Load more button should not be present when loading
    expect(screen.queryByText('Załaduj więcej')).not.toBeInTheDocument();
  });

  it('handles adding a perfume successfully', async () => {
    const mockItem = { 
      id: '1', 
      name: 'Perfume 1', 
      brand: { name: 'Brand 1' }, 
      isInCollection: false, 
      isBeingAdded: false 
    };
    const mockResponse = { id: 'collection-id', perfume_id: '1' };

    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: [mockItem],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    mockAddPerfume.mockResolvedValue(mockResponse);

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    const addBtn = screen.getByTestId('add-btn-1');
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(mockAddPerfume).toHaveBeenCalledWith('1');
    expect(mockOnPerfumeAdded).toHaveBeenCalledWith(mockResponse);
  });

  it('handles error when adding a perfume fails', async () => {
    // This tests that it doesn't crash and maybe logs error (console error mocking might be needed if strictly testing logs)
    const mockItem = { 
      id: '1', 
      name: 'Perfume 1', 
      brand: { name: 'Brand 1' }, 
      isInCollection: false, 
      isBeingAdded: false 
    };

    (usePublicPerfumes as any).mockReturnValue({
      status: 'success',
      items: [mockItem],
      search: mockSearch,
      loadMore: mockLoadMore,
      hasMore: false,
      addPerfume: mockAddPerfume,
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAddPerfume.mockRejectedValue(new Error('Failed'));

    render(
      <AddPerfumeModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onPerfumeAdded={mockOnPerfumeAdded} 
        existingCollectionIds={new Set()} 
      />
    );

    const addBtn = screen.getByTestId('add-btn-1');
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(mockAddPerfume).toHaveBeenCalledWith('1');
    expect(mockOnPerfumeAdded).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
