import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmployeesPage from './page';

// Mock API
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked((await import('@/services/api')).default);

describe('Employees Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.get.mockResolvedValue({ data: [] });
  });

  it('renders heading and Add Employee button', () => {
    render(<EmployeesPage />);
    expect(screen.getByText('Manage Employees')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /\+ Add Employee/i })).toBeInTheDocument();
  });

  it('shows loading state on initial render', () => {
    render(<EmployeesPage />);
    expect(screen.getByText('Fetching employees...')).toBeInTheDocument();
  });

  it('fetches employees from API on mount', async () => {
    render(<EmployeesPage />);

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/employees', expect.any(Object));
    });
  });

  it('shows error state when API call fails', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'));

    render(<EmployeesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load employees/i)).toBeInTheDocument();
    });
  });

  it('allows retry after error', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Failed'));
    mockedApi.get.mockResolvedValueOnce({ data: [] });

    render(<EmployeesPage />);

    await waitFor(() => {
      const retryBtn = screen.getByRole('button', { name: /Retry Now/i });
      expect(retryBtn).toBeInTheDocument();
      retryBtn.click();
    });

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledTimes(2);
    });
  });
});